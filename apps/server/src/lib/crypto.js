'use strict';
const crypto = require('crypto');

// Store only this hash, never the raw session token.
function sha256(input) {
  if (typeof input !== 'string' || input.length === 0) {
    throw new TypeError('sha256: input must be a non-empty string');
  }
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

// Primary session id: 512 bits, kept in an httpOnly cookie.
function generateSessionToken() {
  return crypto.randomBytes(64).toString('hex');
}

// Secondary session secret stored in a separate cookie for fingerprint binding.
function generateSessionSig() {
  return crypto.randomBytes(32).toString('hex');
}

// Legacy fingerprint that included the IP; kept only to accept sessions created before.
function buildLegacyFingerprint(ip, userAgent, sessionSig) {
  const normalizedIp  = (ip  || '').trim();
  const normalizedUA  = (userAgent  || '').trim().substring(0, 512);
  const normalizedSig = (sessionSig || '').trim();
  return crypto
    .createHash('sha256')
    .update(normalizedIp + '|' + normalizedUA + '|' + normalizedSig, 'utf8')
    .digest('hex');
}

// Fingerprint of user agent and sig. The IP is deliberately excluded: it changes
// legitimately (wifi/mobile switch, proxies) and used to log users out.
function buildFingerprint(_ip, userAgent, sessionSig) {
  const normalizedUA  = (userAgent  || '').trim().substring(0, 512);
  const normalizedSig = (sessionSig || '').trim();
  return crypto
    .createHash('sha256')
    .update(normalizedUA + '|' + normalizedSig, 'utf8')
    .digest('hex');
}

// Constant-time compare; use it for every secret comparison.
function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  // Pad both to same byte length before Buffer.from to avoid length leakage
  const maxLen = Math.max(Buffer.byteLength(a, 'hex'), Buffer.byteLength(b, 'hex'), 32);
  const bufA = Buffer.alloc(maxLen);
  const bufB = Buffer.alloc(maxLen);
  Buffer.from(a, 'hex').copy(bufA);
  Buffer.from(b, 'hex').copy(bufB);
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  sha256,
  generateSessionToken,
  generateSessionSig,
  buildFingerprint,
  buildLegacyFingerprint,
  timingSafeCompare,
};
