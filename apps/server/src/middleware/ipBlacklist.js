'use strict';
// IP auto-block: tracks abusive behaviour per IP and blocks repeat offenders.
// Abuse signals (rate-limit hits, bot UA hits, malicious payloads) increment a
// counter; crossing the threshold writes a block key with a cooldown TTL.
const redis = require('../utils/redisClient');
const { logSecurityEvent, EVENT } = require('../utils/securityLogger');
const { isPrivateIP } = require('../security/trustProxy');

// Thresholds: how much abuse is tolerated before an IP is blocked.
const ABUSE_WINDOW_SECONDS = 10 * 60; // rolling window for counting strikes
const ABUSE_THRESHOLD = 25; // strikes within the window that trigger a block
const BLOCK_SECONDS = 30 * 60; // how long a blocked IP stays blocked
const ABUSE_KEY_PREFIX = 'ipabuse:';
const BLOCK_KEY_PREFIX = 'ipblock:';

const abuseKey = (ip) => `${ABUSE_KEY_PREFIX}${ip}`;
const blockKey = (ip) => `${BLOCK_KEY_PREFIX}${ip}`;

// Private/loopback addresses are never blocked: they are the proxy itself or
// local development traffic, and blocking them would take the server down.
function isBlockable(ip) {
  return Boolean(ip) && !isPrivateIP(ip);
}

/**
 * Records one abuse strike for an IP. When the strike count within the window
 * reaches the threshold, the IP is blocked for BLOCK_SECONDS.
 * Never throws: an unreachable cache must not break request handling.
 */
async function recordAbuse(ip, reason) {
  if (!isBlockable(ip)) return;
  try {
    const key = abuseKey(ip);
    const strikes = await redis.incr(key);
    if (strikes === 1) {
      await redis.expire(key, ABUSE_WINDOW_SECONDS);
    }
    if (strikes >= ABUSE_THRESHOLD) {
      await redis.set(blockKey(ip), reason || 'abuse', { EX: BLOCK_SECONDS });
      await redis.del(key);
      logSecurityEvent(
        EVENT.SUSPICIOUS_ACTIVITY,
        { ip, details: { reason: 'ip_blocked', trigger: reason, strikes } },
        'warn',
      );
    }
  } catch {
    // Cache failure: fail open for the block list (availability over blocking).
  }
}

/** Blocks an IP immediately, bypassing the strike counter. */
async function blockIp(ip, reason, ttlSeconds = BLOCK_SECONDS) {
  if (!isBlockable(ip)) return;
  try {
    await redis.set(blockKey(ip), reason || 'manual', { EX: ttlSeconds });
    logSecurityEvent(
      EVENT.SUSPICIOUS_ACTIVITY,
      { ip, details: { reason: 'ip_blocked', trigger: reason, manual: true } },
      'warn',
    );
  } catch {
    // Best effort only.
  }
}

/** Returns true when the IP is currently blocked. */
async function isBlocked(ip) {
  if (!isBlockable(ip)) return false;
  try {
    return Boolean(await redis.get(blockKey(ip)));
  } catch {
    // Fail open: a cache outage should not lock out every client.
    return false;
  }
}

/** Middleware: reject blocked IPs with 403 before any route handler runs. */
function ipBlockGuard(req, res, next) {
  const ip = req.ip;
  isBlocked(ip)
    .then((blocked) => {
      if (!blocked) return next();
      logSecurityEvent(
        EVENT.SUSPICIOUS_ACTIVITY,
        { ip, details: { reason: 'blocked_ip_rejected' }, req },
        'warn',
      );
      res.status(403).json({
        status: 'fail',
        error: 'ip_blocked',
        message: 'Your address has been blocked due to abusive behaviour.',
      });
    })
    .catch(() => next());
}

module.exports = {
  ipBlockGuard,
  recordAbuse,
  blockIp,
  isBlocked,
  ABUSE_THRESHOLD,
  BLOCK_SECONDS,
};
