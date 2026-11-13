const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { logSecurityEvent, EVENT } = require("./securityLogger");
const redis = require("./redisClient");
const { recordAbuse } = require("../middleware/ipBlacklist");

// Per-route abuse limits: docs/architecture-notes.md#rate-limiting.

// Share counters across replicas via Redis in production; development keeps
// express-rate-limit's default in-memory store.
const isProduction = process.env.NODE_ENV === "production";
const isDev = !isProduction;
function makeRateLimitStore(prefix) {
  if (!isProduction) return undefined;
  const store = new RedisStore({
    prefix,
    // Never throw synchronously: the RedisStore constructor fires the first
    // SCRIPT LOAD through this callback, and a sync throw there crashes the
    // process while Redis is still connecting. It also retries the load on
    // the first increment(), so early failures are self-healing.
    sendCommand: (...args) => Promise.resolve().then(() => redis.sendCommand(args)),
  });
  // Mark the constructor-issued script loads as handled; a rejection here is
  // retried inside retryableIncrement()/get() on the first real request.
  store.incrementScriptSha.catch(() => {});
  store.getScriptSha.catch(() => {});
  return store;
}

// Worst-case back-off hint; the library reports the window.
function retryAfterSeconds(options) {
  return Math.max(1, Math.ceil(options.windowMs / 1000));
}

/* Builds a limiter with the shared 429 contract. */
function buildLimiter({
  windowMs,
  max,
  message,
  error = "rate_limit_exceeded",
  event = EVENT.RATE_LIMIT_HIT,
  details = {},
}) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    // Production fails closed on cache errors; development fails open so a
    // stopped local Redis does not take the dev server down.
    passOnStoreError: isProduction,
    store: makeRateLimitStore(
      `rl:${String(message).replace(/[^a-z0-9]+/gi, "_").slice(0, 40)}:${max}:${windowMs}:`,
    ),
    handler: (req, res, next, options) => {
      logSecurityEvent(
        event,
        {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: {
            route: req.originalUrl,
            limit: options.max,
            windowMs: options.windowMs,
            ...details,
          },
          req,
        },
        "warn",
      );
      // Repeated limit hits escalate to an IP block.
      recordAbuse(req.ip, `rate_limit:${req.originalUrl}`).catch(() => {});
      res.status(429).json({
        status: "fail",
        error,
        message,
        retryAfter: retryAfterSeconds(options),
      });
    },
  });
}

const loginLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
    "Too many login attempts from this IP, please try again in an hour",
});
const refreshLimiter = buildLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many token refresh requests, please try again later",
});
const googleAuthLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 200 : 20,
  message: "Too many authentication requests, please try again later",
});
// MFA challenge step: separate budget so TOTP typos cannot exhaust login limits.
const mfaChallengeLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  error: "mfa_rate_limit",
  message: "Too many verification attempts. Please try again later.",
  details: { type: "mfa" },
});
const contactLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "Too many contact submissions from this IP, please try again in an hour",
});
const registrationLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "Too many registration requests from this IP, please try again in an hour",
});
const reviewLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many reviews from this IP, please try again later",
});
const csrfTokenLimiter = buildLimiter({
  windowMs: 60 * 1000,
  max: isDev ? 200 : 30,
  message: "Too many CSRF token requests. Please wait a moment.",
});
// Strict signup budget: mitigates email enumeration via the 409 response and
// bulk account creation, without enumerating-hiding UX costs.
const signUpLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  error: "signup_rate_limit",
  message: "Too many signup attempts from this IP, please try again in an hour",
});
// Password reset attempts: the token is high-entropy, but the route is unauthenticated.
const resetPasswordLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  error: "reset_password_rate_limit",
  message: "Too many password reset attempts, please try again in an hour",
});
const forgotPasswordLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  error: "forgot_password_rate_limit",
  message: "Too many password reset requests, please try again in an hour",
});
const apiLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5000,
  message:
    "Այս IP-ից չափազանց շատ հարցումներ են ուղարկվել, խնդրում ենք կրկին փորձել մեկ ժամից։",
});
module.exports = {
  buildLimiter,
  loginLimiter,
  mfaChallengeLimiter,
  refreshLimiter,
  googleAuthLimiter,
  contactLimiter,
  registrationLimiter,
  reviewLimiter,
  csrfTokenLimiter,
  signUpLimiter,
  resetPasswordLimiter,
  forgotPasswordLimiter,
  apiLimiter,
};
