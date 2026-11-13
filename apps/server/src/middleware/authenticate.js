'use strict';
// Double-cookie session auth; resolves req.user or fails with 401/403.
const {
  sha256,
  buildFingerprint,
  buildLegacyFingerprint,
  timingSafeCompare,
} = require('../lib/crypto');
const {
  getSessionFromCookies,
  invalidateSession,
  updateSessionActivity,
  slideSession,
  rotateIfDue,
  clearSessionCookies,
  normalizeUserAgent,
  IDLE_TIMEOUT_MS,
} = require('../lib/session');
const { logSecurityEvent, EVENT } = require('../utils/securityLogger');

// Lazy access avoids the models/index -> rateLimiter -> models cycle.
function getUser()         { return require('../models').models.User; }
function getStudentGroup() { return require('../models').models.StudentGroup; }
function getFile()         { return require('../models').models.File; }

async function authenticate(req, res, next) {
  const sessionToken = req.cookies?.['session_token'];
  const sessionSig   = req.cookies?.['session_sig'];

  // Both cookies are required
  if (!sessionToken || !sessionSig) {
    return res.status(401).json({
      status:  'fail',
      error:   'unauthorized',
      message: 'Authentication required.',
    });
  }

  let session;
  try {
    session = await getSessionFromCookies(req);
  } catch (err) {
    console.error('[authenticate] session lookup error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }

  if (!session) {
    logSecurityEvent(EVENT.INVALID_SESSION_TOKEN, {
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
      req,
    }, 'warn');
    clearSessionCookies(res);
    return res.status(401).json({
      status:  'fail',
      error:   'session_not_found',
      message: 'Session not found. Please log in again.',
    });
  }

  if (!session.is_valid) {
    clearSessionCookies(res);

    // Tell the client WHY they were logged out (drives UX messaging)
    if (session.invalidation_reason === 'new_login') {
      return res.status(401).json({
        status:  'fail',
        error:   'kicked_out',
        message: 'Your account was signed in from another device. You have been logged out.',
      });
    }
    return res.status(401).json({
      status:  'fail',
      error:   'session_invalidated',
      reason:  session.invalidation_reason || 'unknown',
      message: 'Your session has been invalidated. Please log in again.',
    });
  }

  if (new Date() > new Date(session.expires_at)) {
    await invalidateSession(session._tokenHash, 'expired').catch(() => {});
    clearSessionCookies(res);
    return res.status(401).json({
      status:  'fail',
      error:   'session_expired',
      message: 'Your session has expired. Please log in again.',
    });
  }

  // Idle timeout: last_used_at is refreshed on every authenticated request.
  if (
    session.last_used_at &&
    Date.now() - new Date(session.last_used_at).getTime() > IDLE_TIMEOUT_MS
  ) {
    await invalidateSession(session._tokenHash, 'expired').catch(() => {});
    clearSessionCookies(res);
    return res.status(401).json({
      status:  'fail',
      error:   'session_expired',
      message: 'Your session has expired due to inactivity.',
    });
  }

  // STRICT User-Agent binding: a stolen cookie replayed from another browser
  // destroys the session in MySQL, clears the cookie and returns 401.
  const presentedUA = normalizeUserAgent(req.headers['user-agent']);
  const storedUA    = normalizeUserAgent(session.user_agent);
  if (presentedUA !== storedUA) {
    // Awaited and not swallowed: a failed delete must not leave a live session.
    try {
      await invalidateSession(session._tokenHash, 'suspicious');
    } catch (err) {
      console.error('[authenticate] failed to destroy hijacked session:', err);
    }
    logSecurityEvent(EVENT.FINGERPRINT_MISMATCH, {
      ip:        req.ip,
      userId:    session.user_id,
      userAgent: req.headers['user-agent'],
      details:   { reason: 'user_agent_mismatch', storedUA, presentedUA },
      req,
    }, 'warn');
    clearSessionCookies(res);
    return res.status(401).json({
      status:  'fail',
      error:   'fingerprint_mismatch',
      message: 'Session context mismatch. Please log in again.',
    });
  }

  if (!timingSafeCompare(session.session_sig, sessionSig)) {
    await invalidateSession(session._tokenHash, 'suspicious').catch(() => {});
    logSecurityEvent(EVENT.SIG_MISMATCH, {
      ip:        req.ip,
      userId:    session.user_id,
      userAgent: req.headers['user-agent'],
      req,
    }, 'warn');
    clearSessionCookies(res);
    return res.status(401).json({
      status:  'fail',
      error:   'sig_mismatch',
      message: 'Session signature mismatch. Possible token hijacking attempt.',
    });
  }

  const currentFingerprint = buildFingerprint(
    req.ip,
    req.headers['user-agent'],
    sessionSig,
  );
  const legacyFingerprint = buildLegacyFingerprint(
    req.ip,
    req.headers['user-agent'],
    sessionSig,
  );
  if (
    !timingSafeCompare(currentFingerprint, session.fingerprint_hash) &&
    !timingSafeCompare(legacyFingerprint, session.fingerprint_hash)
  ) {
    await invalidateSession(session._tokenHash, 'suspicious').catch(() => {});
    logSecurityEvent(EVENT.FINGERPRINT_MISMATCH, {
      ip:        req.ip,
      userId:    session.user_id,
      userAgent: req.headers['user-agent'],
      details:   { stored: session.fingerprint_hash, current: currentFingerprint },
      req,
    }, 'warn');
    clearSessionCookies(res);
    return res.status(401).json({
      status:  'fail',
      error:   'fingerprint_mismatch',
      message: 'Session context mismatch. Please log in again.',
    });
  }

  let user;
  try {
    user = await getUser().findByPk(session.user_id, {
      include: [
        { model: getStudentGroup(), as: 'studentGroup' },
        { model: getFile(), as: 'files' },
      ],
    });
  } catch (err) {
    console.error('[authenticate] user lookup error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }

  if (!user) {
    clearSessionCookies(res);
    return res.status(401).json({
      status:  'fail',
      error:   'user_not_found',
      message: 'Associated user account no longer exists.',
    });
  }

  if (user.disabledAt || user.deleted) {
    clearSessionCookies(res);
    return res.status(403).json({
      status:  'fail',
      error:   'account_suspended',
      message: 'Your account has been disabled. Please contact support.',
    });
  }

  // Non-blocking activity timestamp update (always against the row's current hash).
  const tokenHash = session._tokenHash;
  updateSessionActivity(tokenHash).catch(() => {});

  // Rotate the token periodically; a rotation also renews expiry, so skip sliding.
  req.user = user;
  const rotated = await rotateIfDue(req, res, session);
  if (!rotated && !session._viaGrace) {
    slideSession(req, res, session, tokenHash, sessionSig, currentFingerprint)
      .catch(() => {});
  }

  req.user         = user;
  req.oauthSession = session;
  if (user) {
    const { password, ...safe } = user.toJSON ? user.toJSON() : user;
    res.locals.user = safe;
  }

  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', error: 'unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      logSecurityEvent(EVENT.ADMIN_ACCESS_DENIED, {
        userId: req.user?.id,
        ip:     req.ip,
        details: { requiredRoles: roles, actualRole: req.user?.role },
        req,
      }, 'warn');
      return res.status(403).json({
        status:  'fail',
        error:   'forbidden',
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
}

// requireStepUp(maxAgeMinutes): require a recent MFA confirmation.
function requireStepUp(maxAgeMinutes = 15) {
  const maxAgeMs = maxAgeMinutes * 60 * 1000;
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', error: 'unauthorized' });
    }
    // No second factor enrolled, so nothing to enforce.
    if (!req.user.mfaEnabledAt) {
      return next();
    }
    const verifiedAt = req.user.mfaVerifiedAt
      ? new Date(req.user.mfaVerifiedAt).getTime()
      : 0;
    const fresh = verifiedAt > 0 && Date.now() - verifiedAt <= maxAgeMs;
    if (!fresh) {
      logSecurityEvent(EVENT.STEP_UP_REQUIRED, {
        userId: req.user.id,
        ip:     req.ip,
        details: {
          route: `${req.method} ${req.originalUrl || req.url}`,
          maxAgeMinutes,
        },
        req,
      }, 'warn');
      return res.status(403).json({
        status:  'fail',
        error:   'step_up_required',
        message: 'This action requires a recent multi-factor verification.',
      });
    }
    next();
  };
}

module.exports = { authenticate, requireRole, requireStepUp };
