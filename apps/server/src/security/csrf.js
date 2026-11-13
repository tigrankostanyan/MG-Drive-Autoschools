// CSRF: HMAC-signed double-submit cookie, stateless and time-limited.
"use strict";
const crypto = require("crypto");
const AppError = require("../utils/appError");
const CSRF_COOKIE_NAME = "_csrf";
const CSRF_TOKEN_HEADER = "x-csrf-token";
const CSRF_SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
// Token validity window: 1 hour (HMAC payload carries issued-at timestamp)
const CSRF_TOKEN_MAX_AGE_MS = 1 * 60 * 60 * 1000;
// Separator inside the token payload; absent from hex strings
const SEP = ".";
const MIN_SECRET_LENGTH = 32;
const CSRF_KEY_LABEL = "mg-drive:csrf:v1";
// Derives a CSRF-specific subkey so the JWT signing key is never reused.
function deriveCsrfKey(baseSecret) {
  return crypto.createHmac("sha256", baseSecret).update(CSRF_KEY_LABEL).digest();
}
// Prefer CSRF_SECRET; otherwise use a domain-separated subkey of JWT_SECRET.
function getCsrfSecret() {
  const dedicated = process.env.CSRF_SECRET;
  if (dedicated) {
    if (dedicated.length < MIN_SECRET_LENGTH) {
      throw new Error(
        `[CSRF] CSRF_SECRET must be at least ${MIN_SECRET_LENGTH} characters long.`,
      );
    }
    return dedicated;
  }
  const fallback = process.env.JWT_SECRET;
  if (!fallback) {
    throw new Error(
      "[CSRF] Neither CSRF_SECRET nor JWT_SECRET is set. " +
        "Set at least one in your environment variables.",
    );
  }
  // Fail closed when the fallback secret is too weak for real key separation.
  if (fallback.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `[CSRF] JWT_SECRET (used as the CSRF fallback secret) must be at least ` +
        `${MIN_SECRET_LENGTH} characters long. Set a dedicated CSRF_SECRET.`,
    );
  }
  if (!getCsrfSecret._warned) {
    getCsrfSecret._warned = true;
    console.warn(
      "[CSRF] CSRF_SECRET is not set; using a domain-separated subkey derived " +
        "from JWT_SECRET. Set a dedicated CSRF_SECRET (min 32 chars) in production.",
    );
  }
  return deriveCsrfKey(fallback);
}
// Format: <nonce>.<issuedAt>.<hmac> (nonce hex, issuedAt base-36, hmac hex)
function generateToken() {
  const secret = getCsrfSecret();
  const nonce = crypto.randomBytes(32).toString("hex");
  const issuedAt = Date.now().toString(36);
  const payload = `${nonce}${SEP}${issuedAt}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${payload}${SEP}${hmac}`;
}
// Verify an HMAC-signed CSRF token; returns { valid } or { valid: false, reason }
function verifyToken(token) {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "missing" };
  }
  const parts = token.split(SEP);
  if (parts.length !== 3) {
    return { valid: false, reason: "malformed" };
  }
  const [nonce, issuedAtB36, providedHmac] = parts;
  let expectedHmac;
  try {
    const secret = getCsrfSecret();
    const payload = `${nonce}${SEP}${issuedAtB36}`;
    expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
  } catch {
    return { valid: false, reason: "config_error" };
  }
  let match = false;
  try {
    match = crypto.timingSafeEqual(
      Buffer.from(expectedHmac, "hex"),
      Buffer.from(providedHmac.padEnd(expectedHmac.length, "0"), "hex"),
    );
  } catch {
    return { valid: false, reason: "comparison_error" };
  }
  if (!match) {
    return { valid: false, reason: "invalid_signature" };
  }
  const issuedAt = parseInt(issuedAtB36, 36);
  if (isNaN(issuedAt) || Date.now() - issuedAt > CSRF_TOKEN_MAX_AGE_MS) {
    return { valid: false, reason: "expired" };
  }
  return { valid: true };
}
function buildCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: false, // JS must read it for the double-submit pattern
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "strict" : "lax",
    maxAge: CSRF_COOKIE_MAX_AGE_MS,
    path: "/",
  };
}
function setCsrfCookie(res, token) {
  res.cookie(CSRF_COOKIE_NAME, token, buildCookieOptions());
}
function generateCsrfToken(req, res, next) {
  if (res.locals.csrfToken) {
    return next();
  }
  const existing = req.cookies?.[CSRF_COOKIE_NAME];
  if (existing) {
    const check = verifyToken(existing);
    if (check.valid) {
      res.locals.csrfToken = existing;
      return next();
    }
  }
  const token = generateToken();
  setCsrfCookie(res, token);
  if (req.cookies) {
    req.cookies[CSRF_COOKIE_NAME] = token;
  }
  res.locals.csrfToken = token;
  next();
}
// Defense in depth: reject requests whose declared Origin is not ours.
function normalizeOrigin(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .toLowerCase();
}
function getAllowedOrigins(req) {
  const allowed = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    process.env.FRONTEND_URL,
    process.env.SERVER_URL,
  ]
    .filter(Boolean)
    .map(normalizeOrigin);
  const host = req.get?.("host");
  if (host) {
    allowed.push(`https://${host}`.toLowerCase(), `http://${host}`.toLowerCase());
  }
  return allowed;
}
function checkTrustedOrigin(req) {
  const origin = req.get?.("origin");
  if (origin) {
    // "null" comes from sandboxed frames or opaque origins, never trusted
    if (normalizeOrigin(origin) === "null") {
      return { ok: false, reason: "opaque_origin" };
    }
    const normalized = normalizeOrigin(origin);
    if (!getAllowedOrigins(req).includes(normalized)) {
      // In development, allow any localhost origin — the Vite dev server
      // proxy and browser may use ports (8080, 3300, etc.) that aren't
      // explicitly whitelisted in env vars, which would cause spurious
      // 403 CSRF rejections on proxied /api requests.
      if (
        process.env.NODE_ENV !== "production" &&
        (normalized.startsWith("http://localhost:") ||
          normalized === "http://localhost" ||
          normalized.startsWith("http://127.0.0.1:") ||
          normalized === "http://127.0.0.1")
      ) {
        return { ok: true };
      }
      return { ok: false, reason: "origin_not_allowed" };
    }
    return { ok: true };
  }
  // No Origin header: fall back to Fetch Metadata, which pages cannot forge.
  if (req.get?.("sec-fetch-site") === "cross-site") {
    return { ok: false, reason: "cross_site_fetch" };
  }
  return { ok: true };
}
function csrfProtection(req, res, next) {
  if (CSRF_SAFE_METHODS.has(req.method)) {
    return next();
  }
  const originCheck = checkTrustedOrigin(req);
  if (!originCheck.ok) {
    return next(
      new AppError(
        "Request origin is not allowed. Please refresh the page.",
        403,
        "CSRF_UNTRUSTED_ORIGIN",
      ),
    );
  }
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  // Body and header only: a token in the query string leaks into logs,
  // referrer headers and browser history.
  const requestToken = req.headers[CSRF_TOKEN_HEADER] || req.body?._csrf;
  if (!cookieToken) {
    return next(
      new AppError(
        "CSRF cookie missing. Please refresh the page.",
        403,
        "CSRF_COOKIE_MISSING",
      ),
    );
  }
  if (!requestToken) {
    return next(
      new AppError(
        "CSRF token missing in request. Please refresh the page.",
        403,
        "CSRF_FORM_MISSING",
      ),
    );
  }
  // Cookie and request tokens must match (timing-safe, byte-by-byte)
  let tokensMatch = false;
  try {
    const a = Buffer.from(cookieToken, "utf8");
    const b = Buffer.from(requestToken, "utf8");
    // timingSafeEqual needs equal lengths, so pad the shorter one
    const len = Math.max(a.length, b.length);
    const aBuf = Buffer.concat([a, Buffer.alloc(len - a.length)]);
    const bBuf = Buffer.concat([b, Buffer.alloc(len - b.length)]);
    tokensMatch = a.length === b.length && crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return next(
      new AppError(
        "CSRF validation error. Please refresh the page.",
        403,
        "CSRF_ERROR",
      ),
    );
  }
  if (!tokensMatch) {
    return next(
      new AppError(
        "CSRF token mismatch. Please refresh the page.",
        403,
        "CSRF_MISMATCH",
      ),
    );
  }
  const verification = verifyToken(cookieToken);
  if (!verification.valid) {
    const codeMap = {
      expired: "CSRF_EXPIRED",
      invalid_signature: "CSRF_INVALID",
      malformed: "CSRF_MALFORMED",
    };
    return next(
      new AppError(
        "CSRF token invalid. Please refresh the page.",
        403,
        codeMap[verification.reason] || "CSRF_INVALID",
      ),
    );
  }
  next();
}
function csrfErrorHandler(err, req, res, next) {
  if (!err.code?.startsWith("CSRF")) return next(err);
  const newToken = generateToken();
  setCsrfCookie(res, newToken);
  res.status(403).json({
    status: "error",
    code: err.code,
    message: err.message,
    csrfToken: newToken,
  });
}
module.exports = {
  csrfProtection,
  csrfErrorHandler,
  generateCsrfToken,
  generateToken,
  verifyToken,
  CSRF_COOKIE_NAME,
  CSRF_TOKEN_HEADER,
};
