'use strict';
// Rate limiting layers: general, login attempts, bot detection, suspicious sessions.
const DB        = require('../models');
const redis     = require('../utils/redisClient');
const { sha256 }             = require('../lib/crypto');
const { invalidateSession, clearSessionCookies } = require('../lib/session');
const { logSecurityEvent, EVENT } = require('../utils/securityLogger');
const { buildLimiter }       = require('../utils/limiter');
const { recordAbuse, blockIp } = require('./ipBlacklist');

const { Op } = DB.Sequelize;

const getLoginAttempts = () => DB.models.LoginAttempt;

// General limiter: 100 req/min per IP, from the shared 429 factory.
const generalLimiter = buildLimiter({
  windowMs: 60 * 1000,
  max:      100,
  message:  'Too many requests. Please try again in a minute.',
});

// Login-attempt guard: docs/architecture-notes.md#login-attempt-guard.

/* Tracks login attempts for the identifier path, else req.ip. */
function loginAttemptGuard(identifierPath) {
  return async (req, res, next) => {
    let identifier = req.ip;
    if (identifierPath) {
      const parts = identifierPath.split('.');
      let val = req;
      for (const p of parts) val = val?.[p];
      if (val && typeof val === 'string') {
        identifier = val.toLowerCase().trim();
      }
    }

    const WINDOW_MS         = 15 * 60 * 1000;
    const MAX_FAILS         = 5;   // failures from this address for this account
    const GLOBAL_MAX_FAILS  = 20;  // failures for this account across all addresses
    const cutoff            = new Date(Date.now() - WINDOW_MS);

    const LoginAttempt = getLoginAttempts();
    if (!LoginAttempt) return next(); // model not yet loaded — skip

    const failWhere = {
      identifier,
      success:     false,
      attemptedAt: { [Op.gte]: cutoff },
    };

    // Count recent failures for this account *from this address*
    const failCount = await LoginAttempt.count({
      where: { ...failWhere, ipAddress: req.ip },
    }).catch(() => 0);

    if (failCount < MAX_FAILS) {
      // Distributed attack guard: also cap failures for the account across
      // every source address, so rotating IPs does not bypass the lockout.
      var globalFailCount = await LoginAttempt.count({
        where: failWhere,
      }).catch(() => 0);
    }

    if (failCount >= MAX_FAILS || globalFailCount >= GLOBAL_MAX_FAILS) {
      logSecurityEvent(EVENT.LOGIN_ATTEMPT_BLOCKED, {
        ip:        req.ip,
        details:   {
          identifier: identifier.substring(0, 64),
          failCount,
          globalFailCount,
          scope: failCount >= MAX_FAILS ? 'account_address' : 'account_global',
        },
        req,
      }, 'warn');
      return res.status(429).json({
        status:  'fail',
        error:   'too_many_attempts',
        message: 'Too many failed login attempts. Please try again in 15 minutes.',
        // Fixed 15-minute window: the worst-case wait is known and reported.
        retryAfter: WINDOW_MS / 1000,
      });
    }

    // Attach helpers to req so controllers can call them without re-resolving
    req._loginIdentifier = identifier;
    req.recordLoginSuccess = () => _recordAttempt(LoginAttempt, identifier, req.ip, true);
    req.recordLoginFailure = () => _recordAttempt(LoginAttempt, identifier, req.ip, false);

    next();
  };
}

async function _recordAttempt(model, identifier, ip, success) {
  // IPs stay verbatim here; the redaction rule covers logs, not this security record.
  await model.create({ identifier, ipAddress: ip, success }).catch(() => {});
}

const BLOCKED_UA_PATTERNS = [
  'python-requests',
  'python-urllib',
  'go-http-client',
  'curl/',
  'wget/',
  'libwww-perl',
  'scrapy',
  'httpie',
  'okhttp',
  'java/',
  'apache-httpclient',
  'axios/', // legitimate browser axios sends its own UA — block raw CLI axios
  'node-fetch',
  'undici',
  'got/',
  'superagent',
  'ruby',
  'perl/',
  'perl5',
  'masscan',
  'nikto',
  'sqlmap',
  'zgrab',
  'nuclei',
];

// Unambiguous attack tooling: a single hit blocks the IP outright.
const MALICIOUS_UA_PATTERNS = [
  'sqlmap',
  'nikto',
  'masscan',
  'zgrab',
  'nuclei',
];

function botDetector(req, res, next) {
  const ua = (req.headers['user-agent'] || '').trim();

  if (!ua) {
    logSecurityEvent(EVENT.BOT_DETECTED, {
      ip: req.ip,
      details: { reason: 'missing_ua', ua: '' },
      req,
    }, 'warn');
    recordAbuse(req.ip, 'bot:missing_ua').catch(() => {});
    return res.status(403).json({
      status:  'fail',
      error:   'bot_detected',
      message: 'Automated requests are not allowed.',
    });
  }

  const lower = ua.toLowerCase();
  const matched = BLOCKED_UA_PATTERNS.find((p) => lower.includes(p.toLowerCase()));
  if (matched) {
    const malicious = MALICIOUS_UA_PATTERNS.includes(matched);
    logSecurityEvent(EVENT.BOT_DETECTED, {
      ip: req.ip,
      details: { reason: 'blocked_ua', pattern: matched, ua: ua.substring(0, 200) },
      req,
    }, 'warn');
    // Attack tooling blocks immediately; other bots accumulate strikes.
    if (malicious) {
      blockIp(req.ip, `malicious_ua:${matched}`).catch(() => {});
    } else {
      recordAbuse(req.ip, `bot:${matched}`).catch(() => {});
    }
    return res.status(403).json({
      status:  'fail',
      error:   'bot_detected',
      message: 'Automated requests are not allowed.',
    });
  }

  next();
}

async function suspiciousSessionDetector(req, res, next) {
  const sessionToken = req.cookies?.['session_token'];
  if (!sessionToken) return next();

  const tokenHash = sha256(sessionToken);
  const redisKey  = `sess_ips:${tokenHash}`;
  const now       = Date.now();
  const windowMs  = 60_000;

  try {
    await redis.zAdd(redisKey, [{ score: now, value: req.ip }]);
    await redis.expire(redisKey, 120);

    await redis.zRemRangeByScore(redisKey, '-inf', now - windowMs);

    const distinctIPs = await redis.zCard(redisKey);

    if (distinctIPs >= 2) {
      // Same token from multiple IPs: likely stolen or proxied.
      await invalidateSession(tokenHash, 'suspicious').catch(() => {});
      await redis.del(redisKey).catch(() => {});

      logSecurityEvent(EVENT.SUSPICIOUS_ACTIVITY, {
        ip:      req.ip,
        details: { reason: 'multi_ip_session', distinctIPs, tokenHashPrefix: tokenHash.substring(0, 12) },
        req,
      }, 'warn');

      // Use the canonical helper so this clear cannot drift from the cookie policy.
      clearSessionCookies(res);

      return res.status(401).json({
        status:  'fail',
        error:   'suspicious_session',
        message: 'Your session was detected from multiple locations and has been invalidated for your security.',
      });
    }
  } catch (_) {
    // Redis error: never block a legitimate request over monitoring.
  }

  next();
}

module.exports = {
  generalLimiter,
  loginAttemptGuard,
  botDetector,
  suspiciousSessionDetector,
};
