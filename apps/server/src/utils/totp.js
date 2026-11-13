"use strict";
// RFC 6238 TOTP on Node's crypto, with no native dependency.
const crypto = require("crypto");

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const DEFAULT_STEP_SECONDS = 30;
const DEFAULT_DIGITS = 6;
const DEFAULT_ALGORITHM = "sha1";

// RFC 4648 base32, unpadded so authenticator apps accept the secret.
function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

// Tolerant base32 decode; returns null on characters outside the alphabet.
function base32Decode(input) {
  if (typeof input !== "string") return null;
  const normalized = input.toUpperCase().replace(/[\s=]/g, "");
  if (!normalized) return null;
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (const char of normalized) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) return null;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

// 20 bytes (160 bits) base32-encodes to the 32 characters apps expect.
function generateSecret(bytes = 20) {
  return base32Encode(crypto.randomBytes(bytes));
}

// RFC 4226 §5.3 dynamic truncation.
function hotp(secret, counter, options = {}) {
  const { digits = DEFAULT_DIGITS, algorithm = DEFAULT_ALGORITHM } = options;
  const key = base32Decode(secret);
  if (!key || key.length === 0) {
    throw new Error("hotp: secret must be a valid base32 string");
  }
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  const digest = crypto
    .createHmac(algorithm, key)
    .update(counterBuffer)
    .digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  const modulo = 10 ** digits;
  return String(binary % modulo).padStart(digits, "0");
}

function totp(secret, options = {}) {
  const {
    time = Date.now(),
    step = DEFAULT_STEP_SECONDS,
    digits = DEFAULT_DIGITS,
    algorithm = DEFAULT_ALGORITHM,
  } = options;
  const counter = Math.floor(time / 1000 / step);
  return hotp(secret, counter, { digits, algorithm });
}

// Constant-time compare that tolerates different lengths without leaking.
function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a), "utf8");
  const bufB = Buffer.from(String(b), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Accepts the current step plus a ±window skew; returns { valid, delta }.
function verifyTotp(secret, token, options = {}) {
  const {
    window = 1,
    step = DEFAULT_STEP_SECONDS,
    digits = DEFAULT_DIGITS,
    algorithm = DEFAULT_ALGORITHM,
    time = Date.now(),
  } = options;
  if (!secret || typeof token !== "string") {
    return { valid: false, delta: null };
  }
  const candidate = token.replace(/\s+/g, "");
  if (!new RegExp(`^\\d{${digits}}$`).test(candidate)) {
    return { valid: false, delta: null };
  }
  const currentCounter = Math.floor(time / 1000 / step);
  for (let delta = -window; delta <= window; delta++) {
    const expected = hotp(secret, currentCounter + delta, { digits, algorithm });
    if (timingSafeStringEqual(expected, candidate)) {
      return { valid: true, delta };
    }
  }
  return { valid: false, delta: null };
}

// Useful for client-side countdown UI.
function getRemainingSeconds(step = DEFAULT_STEP_SECONDS, time = Date.now()) {
  const elapsed = Math.floor(time / 1000) % step;
  return step - elapsed;
}

// otpauth:// URI consumed by Google Authenticator, Aegis and 1Password.
function buildOtpAuthUri({
  secret,
  accountName,
  issuer,
  digits = DEFAULT_DIGITS,
  step = DEFAULT_STEP_SECONDS,
  algorithm = DEFAULT_ALGORITHM,
}) {
  const label = encodeURIComponent(accountName || "account");
  const issuerLabel = issuer ? `${encodeURIComponent(issuer)}:` : "";
  const params = new URLSearchParams({
    secret,
    digits: String(digits),
    period: String(step),
    algorithm: algorithm.toUpperCase(),
  });
  if (issuer) params.set("issuer", issuer);
  return `otpauth://totp/${issuerLabel}${label}?${params.toString()}`;
}

// Single-use recovery codes; only the SHA-256 hash is ever persisted.
function hashRecoveryCode(code) {
  return crypto
    .createHash("sha256")
    .update(String(code).trim().toUpperCase())
    .digest("hex");
}

function generateRecoveryCodes(count = 10) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    // 10 random bytes -> 16 base32 chars, grouped in 4s for readability.
    const raw = base32Encode(crypto.randomBytes(10));
    const code = raw.match(/.{1,4}/g).join("-");
    codes.push({ code, hash: hashRecoveryCode(code) });
  }
  return codes;
}

// Constant-time scan of stored hashes; the caller deletes the match.
function verifyRecoveryCode(code, hashes) {
  if (!code || !Array.isArray(hashes) || hashes.length === 0) {
    return { valid: false, index: -1 };
  }
  const candidate = hashRecoveryCode(code);
  const candidateBuf = Buffer.from(candidate, "hex");
  let matchedIndex = -1;
  for (let i = 0; i < hashes.length; i++) {
    const stored = String(hashes[i] || "");
    if (stored.length !== candidate.length) continue;
    const storedBuf = Buffer.from(stored, "hex");
    if (
      storedBuf.length === candidateBuf.length &&
      crypto.timingSafeEqual(storedBuf, candidateBuf)
    ) {
      matchedIndex = i;
    }
  }
  return { valid: matchedIndex !== -1, index: matchedIndex };
}

module.exports = {
  BASE32_ALPHABET,
  DEFAULT_STEP_SECONDS,
  DEFAULT_DIGITS,
  DEFAULT_ALGORITHM,
  base32Encode,
  base32Decode,
  generateSecret,
  hotp,
  totp,
  verifyTotp,
  getRemainingSeconds,
  buildOtpAuthUri,
  hashRecoveryCode,
  generateRecoveryCodes,
  verifyRecoveryCode,
};
