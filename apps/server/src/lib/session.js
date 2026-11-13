'use strict';
const redis = require('../utils/redisClient');
const {
  sha256,
  generateSessionToken,
  generateSessionSig,
  buildFingerprint,
} = require('./crypto');
const { logSecurityEvent, EVENT } = require('../utils/securityLogger');
const { notifyKickedOut } = require('./sse');
const { authCookieOptions, IDLE_TIMEOUT_MS } = require('../constants/session');

// Lazy getter breaks the models/index -> rateLimiter -> session require cycle.
function getOAuthSession() {
  return require('../models').models.OAuthSession;
}

// Redis TTL matches the cookie MaxAge: 10 days, in seconds
const SESSION_TTL_SECONDS = 10 * 24 * 60 * 60;
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;

// Delegates to the canonical cookie policy so the two models cannot drift.
function cookieOpts(req, overrides = {}) {
  return authCookieOptions(req, {
    maxAge: SESSION_TTL_MS,
    ...overrides,
  });
}

function sessionKey(tokenHash) {
  return `session:${tokenHash}`;
}

// Same normalization on write and compare, so the strict UA check is stable.
function normalizeUserAgent(ua) {
  return String(ua || '').trim().substring(0, 512);
}

// Rotate the session token at most this often; old token stays valid briefly
// so parallel in-flight SPA requests do not 401.
const ROTATE_EVERY_MS = 15 * 60 * 1000;
const ROTATE_GRACE_MS = 30 * 1000;

// Reasons that end a session for good: the row is deleted, not just flagged.
const HARD_DELETE_REASONS = new Set(['manual_logout', 'suspicious', 'expired']);

// Creates a session: invalidate prior ones, mint tokens, set cookies, kick old device.
async function createSessionAndSetCookies(user, req, res) {
  const userId = user.id;

  await getOAuthSession().invalidateAllForUser(userId, 'new_login');

  const oldSessions = await getOAuthSession().getRecentlyInvalidatedHashes(userId);
  for (const s of oldSessions) {
    await redis.del(sessionKey(s.sessionTokenHash)).catch(() => { });
  }

  const sessionToken = generateSessionToken();
  const sessionSig = generateSessionSig();
  const tokenHash = sha256(sessionToken);
  const fingerprint = buildFingerprint(
    req.ip,
    req.headers['user-agent'],
    sessionSig,
  );

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await getOAuthSession().create({
    userId,
    sessionTokenHash: tokenHash,
    sessionSig,
    ipAddress: req.ip || '0.0.0.0',
    userAgent: normalizeUserAgent(req.headers['user-agent']),
    fingerprintHash: fingerprint,
    isValid: true,
    expiresAt,
  });

  const cachePayload = JSON.stringify({
    user_id: userId,
    session_sig: sessionSig,
    fingerprint_hash: fingerprint,
    expires_at: expiresAt.toISOString(),
    is_valid: true,
  });
  await redis.set(sessionKey(tokenHash), cachePayload, { EX: SESSION_TTL_SECONDS }).catch(() => { });

  // Cookie 1 is httpOnly, so XSS cannot read the session token.
  res.cookie('session_token', sessionToken, cookieOpts(req, { httpOnly: true }));

  // The secondary cookie is server-only too; the browser never needs to read it.
  res.cookie('session_sig', sessionSig, cookieOpts(req, { httpOnly: true }));

  notifyKickedOut(userId);

  logSecurityEvent(EVENT.SESSION_CREATED, {
    userId,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    req,
  });

  return { tokenHash, sessionSig, fingerprint, expiresAt };
}

// Resolves the session from MySQL only. Redis is never trusted for reads, so a
// failed cache purge can never resurrect a destroyed session.
async function getSessionFromCookies(req) {
  const sessionToken = req.cookies?.['session_token'];
  if (!sessionToken || typeof sessionToken !== 'string') return null;

  const tokenHash = sha256(sessionToken);
  const { Op } = require('sequelize');

  // Current token, or the just-rotated previous one inside its grace window.
  const row = await getOAuthSession().findOne({
    where: {
      [Op.or]: [
        { sessionTokenHash: tokenHash },
        {
          previousTokenHash: tokenHash,
          previousValidUntil: { [Op.gt]: new Date() },
        },
      ],
    },
  });
  if (!row) return null;

  return {
    ...row.dataValues,
    user_id: row.userId,
    session_sig: row.sessionSig,
    fingerprint_hash: row.fingerprintHash,
    user_agent: row.userAgent,
    expires_at: row.expiresAt,
    last_used_at: row.lastUsedAt,
    rotated_at: row.rotatedAt,
    created_at: row.createdAt,
    is_valid: row.isValid,
    invalidation_reason: row.invalidationReason,
    // The row's CURRENT hash, even when matched through the grace window.
    _tokenHash: row.sessionTokenHash,
    _viaGrace: row.sessionTokenHash !== tokenHash,
    _id: row.id,
  };
}

// Ends a session. Terminal reasons hard-delete the row; others (e.g. new_login,
// which drives the "signed in elsewhere" message) keep it flagged invalid.
async function invalidateSession(tokenHash, reason = 'suspicious') {
  const OAuthSession = getOAuthSession();
  if (HARD_DELETE_REASONS.has(reason)) {
    const { Op } = require('sequelize');
    await OAuthSession.destroy({
      where: {
        [Op.or]: [{ sessionTokenHash: tokenHash }, { previousTokenHash: tokenHash }],
      },
    });
  } else {
    await OAuthSession.update(
      {
        isValid: false,
        invalidatedAt: new Date(),
        invalidationReason: reason,
      },
      { where: { sessionTokenHash: tokenHash } },
    );
  }
  await redis.del(sessionKey(tokenHash)).catch(() => { });
}

// Deletes old rows; run daily.
async function cleanupSessions() {
  const { Op } = require('sequelize');
  const day = 24 * 60 * 60 * 1000;
  return getOAuthSession().destroy({
    where: {
      [Op.or]: [
        { expiresAt: { [Op.lt]: new Date(Date.now() - day) } },
        { isValid: false, invalidatedAt: { [Op.lt]: new Date(Date.now() - 30 * day) } },
      ],
    },
  });
}

// Bulk invalidation for password changes, admin force-logout, etc.
async function revokeAllUserSessions(userId, reason = 'admin_action') {
  await getOAuthSession().invalidateAllForUser(userId, reason);

  const recent = await getOAuthSession().getRecentlyInvalidatedHashes(userId);
  for (const s of recent) {
    await redis.del(sessionKey(s.sessionTokenHash)).catch(() => { });
  }
}

// Called on every authenticated request.
async function updateSessionActivity(tokenHash) {
  const now = new Date();
  await getOAuthSession().update(
    { lastUsedAt: now },
    { where: { sessionTokenHash: tokenHash, isValid: true } },
  );
  await redis.expire(sessionKey(tokenHash), SESSION_TTL_SECONDS).catch(() => { });
}

const SLIDE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

// Renews the 10-day window for active users so they are never logged out while
// using the site. Cookies are set synchronously (before the response is sent);
// storage updates run in the background. Throttled to once per day.
function slideSession(req, res, session, tokenHash, sessionSig) {
  const currentExpiry = new Date(session.expires_at).getTime();
  if (SESSION_TTL_MS - (currentExpiry - Date.now()) < SLIDE_THRESHOLD_MS) {
    return Promise.resolve(false);
  }
  const sessionToken = req.cookies?.['session_token'];
  if (!sessionToken) return Promise.resolve(false);

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  if (!res.headersSent) {
    res.cookie('session_token', sessionToken, cookieOpts(req, { httpOnly: true }));
    res.cookie('session_sig', sessionSig, cookieOpts(req, { httpOnly: true }));
  }
  // Keep the in-memory view consistent for the rest of this request.
  session.expires_at = expiresAt.toISOString();

  return getOAuthSession()
    .update({ expiresAt }, { where: { sessionTokenHash: tokenHash, isValid: true } })
    .then(async () => {
      const key = sessionKey(tokenHash);
      const cached = await redis.get(key).catch(() => null);
      if (!cached) return true;
      const parsed = JSON.parse(cached);
      parsed.expires_at = expiresAt.toISOString();
      delete parsed._tokenHash;
      await redis.set(key, JSON.stringify(parsed), { EX: SESSION_TTL_SECONDS }).catch(() => { });
      return true;
    });
}

// Rotates tokens in place (UPDATE) for periodic or post-sensitive-action rotation.
// The previous token hash stays valid for ROTATE_GRACE_MS (parallel requests).
async function rotateSession(req, res) {
  const sessionToken = req.cookies?.['session_token'];
  if (!sessionToken) return false;

  const oldTokenHash = sha256(sessionToken);

  const newToken = generateSessionToken();
  const newHash = sha256(newToken);

  const now = new Date();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Compare-and-swap on the current hash: of two racing rotations only one wins.
  // session_sig/fingerprint stay unchanged so in-flight requests holding the old
  // sig cookie still pass the signature check during the grace window.
  const [rowsAffected] = await getOAuthSession().update(
    {
      sessionTokenHash: newHash,
      previousTokenHash: oldTokenHash,
      previousValidUntil: new Date(now.getTime() + ROTATE_GRACE_MS),
      rotatedAt: now,
      lastUsedAt: now,
      expiresAt,
    },
    { where: { sessionTokenHash: oldTokenHash, isValid: true } },
  );

  if (rowsAffected === 0) return false;

  await redis.del(sessionKey(oldTokenHash)).catch(() => { });

  res.cookie('session_token', newToken, cookieOpts(req, { httpOnly: true }));

  logSecurityEvent(EVENT.TOKEN_ROTATED, {
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    req,
  });

  return true;
}

// Rotates when the token is older than ROTATE_EVERY_MS. Returns true if rotated.
async function rotateIfDue(req, res, session) {
  // A request that arrived on the grace-window token must not rotate again.
  if (session._viaGrace) return false;
  const last = new Date(session.rotated_at || session.created_at).getTime();
  if (!last || Date.now() - last < ROTATE_EVERY_MS) return false;
  return rotateSession(req, res).catch(() => false);
}

// Clears both session cookies from the browser.
function clearSessionCookies(res) {
  // No request here, so `secure` follows NODE_ENV; deletion matches name and path.
  const base = authCookieOptions();
  res.clearCookie('session_token', { ...base, httpOnly: true });
  res.clearCookie('session_sig', { ...base, httpOnly: true });
}

module.exports = {
  SESSION_TTL_SECONDS,
  SESSION_TTL_MS,
  IDLE_TIMEOUT_MS,
  normalizeUserAgent,
  createSessionAndSetCookies,
  getSessionFromCookies,
  invalidateSession,
  cleanupSessions,
  revokeAllUserSessions,
  updateSessionActivity,
  slideSession,
  rotateSession,
  rotateIfDue,
  clearSessionCookies,
  sessionKey,
};
