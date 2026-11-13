const crypto = require("crypto");
const SENSITIVE_FIELDS = [
  "password",
  "passwordConfirm",
  "passwordCurrent",
  "token",
  "accessToken",
  "refreshToken",
  "jwt",
  "cookie",
  "authorization",
  "googleCredential",
  "csrfToken",
  "secret",
  "client_secret",
];
function sanitizeForLog(obj, depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 3) return "[redacted]";
  if (Array.isArray(obj)) return obj.map((v) => sanitizeForLog(v, depth + 1));
  const cleaned = {};
  for (const key of Object.keys(obj)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_FIELDS.some((f) => lower.includes(f))) {
      cleaned[key] = "[FILTERED]";
      continue;
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      cleaned[key] = sanitizeForLog(obj[key], depth + 1);
    } else if (typeof obj[key] === "string" && obj[key].length > 500) {
      cleaned[key] = obj[key].substring(0, 500) + "...[TRUNCATED]";
    } else {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}
function hashId(value) {
  if (!value) return "anonymous";
  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex")
    .substring(0, 12);
}
// Keep only the routing prefix; raw IPs must never reach logs or audit rows.
function redactIp(ip) {
  if (!ip || typeof ip !== "string") return undefined;
  // Normalise IPv4-mapped IPv6 (::ffff:203.0.113.7) down to its IPv4 form
  const value = ip.trim().replace(/^::ffff:/i, "");
  if (!value) return undefined;
  const v4 = value.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (v4) return `${v4[1]}.x`;
  if (value.includes(":")) {
    const groups = value.split(":").filter(Boolean);
    if (!groups.length) return undefined;
    return `${groups.slice(0, 3).join(":")}::x`;
  }
  return "unknown";
}
const EVENT = {
  LOGIN_SUCCESS: "auth.login.success",
  LOGIN_FAILURE: "auth.login.failure",
  LOGIN_OAUTH_SUCCESS: "auth.login.oauth.success",
  LOGIN_OAUTH_FAILURE: "auth.login.oauth.failure",
  LOGOUT: "auth.logout",
  LOGOUT_ALL: "auth.logout_all",
  REFRESH_SUCCESS: "auth.refresh.success",
  REFRESH_FAILURE: "auth.refresh.failure",
  REFRESH_REUSE_DETECTED: "auth.refresh.reuse_detected",
  SESSION_CREATED: "auth.session.created",
  SESSION_REVOKED: "auth.session.revoked",
  SESSION_EXPIRED: "auth.session.expired",
  TOKEN_ROTATED: "auth.token.rotated",
  PASSWORD_CHANGED: "auth.password.changed",
  ROLE_CHANGED: "auth.role.changed",
  USER_DISABLED: "auth.user.disabled",
  USER_DELETED: "auth.user.deleted",
  ADMIN_ACCESS_DENIED: "auth.admin.access_denied",
  CSRF_FAILURE: "auth.csrf.failure",
  RATE_LIMIT_HIT: "auth.rate_limit.hit",
  SUSPICIOUS_ACTIVITY: "auth.suspicious",
  INVALID_SESSION_TOKEN: "auth.session.invalid_token",
  SIG_MISMATCH: "auth.session.sig_mismatch",
  FINGERPRINT_MISMATCH: "auth.session.fingerprint_mismatch",
  OAUTH_CALLBACK_ERROR: "auth.oauth.callback_error",
  BOT_DETECTED: "auth.bot_detected",
  ADMIN_FORCE_LOGOUT: "auth.admin.force_logout",
  LOGIN_ATTEMPT_BLOCKED: "auth.login.attempt_blocked",
  MFA_CHALLENGE_ISSUED: "auth.mfa.challenge_issued",
  MFA_CHALLENGE_SUCCESS: "auth.mfa.challenge_success",
  MFA_CHALLENGE_FAILURE: "auth.mfa.challenge_failure",
  MFA_ENROLLED: "auth.mfa.enrolled",
  MFA_ENROLLMENT_FAILED: "auth.mfa.enrollment_failed",
  MFA_DISABLED: "auth.mfa.disabled",
  MFA_RECOVERY_CODE_USED: "auth.mfa.recovery_code_used",
  STEP_UP_REQUIRED: "auth.mfa.step_up_required",
};
function logSecurityEvent(eventType, context = {}, level = "info") {
  const entry = {
    timestamp: new Date().toISOString(),
    event: eventType,
    level,
    userId: context.userId ? hashId(context.userId) : undefined,
    sessionId: context.sessionId ? hashId(context.sessionId) : undefined,
    ip: redactIp(context.ip),
    userAgent: context.userAgent
      ? context.userAgent.substring(0, 200)
      : undefined,
    details: context.details ? sanitizeForLog(context.details) : undefined,
    route: context.req
      ? `${context.req.method} ${context.req.originalUrl || context.req.url}`
      : undefined,
  };
  Object.keys(entry).forEach((k) => entry[k] === undefined && delete entry[k]);
  const logLine = JSON.stringify(entry);
  switch (level) {
    case "error":
      console.error(`[SECURITY] ${logLine}`);
      break;
    case "warn":
      console.warn(`[SECURITY] ${logLine}`);
      break;
    default:
      console.log(`[SECURITY] ${logLine}`);
  }
  // Persist to DB for audit trail in production
  if (process.env.NODE_ENV === "production") {
    persistEvent(entry).catch(() => { });
  }
}
// Best-effort audit persistence; surface the missing-model gap once, loudly.
let persistenceWarningEmitted = false;
async function persistEvent(entry) {
  try {
    const { SecurityEvent } = require("../models").models;
    if (!SecurityEvent) {
      throw new Error("SecurityEvent model is not registered in models/index.js");
    }
    await SecurityEvent.create({
      event: entry.event,
      level: entry.level,
      // Already a truncated hash, never a raw id; parse it as-is.
      userId: entry.userId || null,
      ip: entry.ip,
      userAgent: entry.userAgent,
      details: JSON.stringify(entry.details || {}),
      route: entry.route,
    });
  } catch (err) {
    if (!persistenceWarningEmitted) {
      persistenceWarningEmitted = true;
      console.error(
        "[SECURITY] Audit persistence unavailable — security events are " +
          "stdout-only. Reason:",
        err.message,
      );
    }
  }
}
module.exports = {
  EVENT,
  logSecurityEvent,
  hashId,
  sanitizeForLog,
};
