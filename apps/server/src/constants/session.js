// Session lifetime policy: single source of truth for all callers.
const DAY_MS = 24 * 60 * 60 * 1000;

const ACCESS_TOKEN_EXPIRY_MINUTES = 15;
const ACCESS_TOKEN_EXPIRY_SECONDS = ACCESS_TOKEN_EXPIRY_MINUTES * 60;

const REFRESH_TOKEN_ABSOLUTE_DAYS = 10;
const IDLE_TIMEOUT_DAYS = 10;

const IDLE_TIMEOUT_MS = IDLE_TIMEOUT_DAYS * DAY_MS;
const ABSOLUTE_EXPIRY_MS = REFRESH_TOKEN_ABSOLUTE_DAYS * DAY_MS;

// Canonical credential-cookie policy shared by both session models.
function isHttpsRequest(req) {
  if (req?.secure) return true;
  const proto = req?.headers?.["x-forwarded-proto"];
  if (typeof proto === "string") {
    return proto.split(",")[0].trim().toLowerCase() === "https";
  }
  return false;
}

function authCookieOptions(req, { httpOnly = true, maxAge } = {}) {
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly,
    secure: isProduction || isHttpsRequest(req),
    sameSite: "strict",
    path: "/",
    // `domain` is intentionally omitted, making the cookie host-only
  };
  if (typeof maxAge === "number") options.maxAge = maxAge;
  return options;
}

module.exports = {
  DAY_MS,
  ACCESS_TOKEN_EXPIRY_MINUTES,
  ACCESS_TOKEN_EXPIRY_SECONDS,
  REFRESH_TOKEN_ABSOLUTE_DAYS,
  IDLE_TIMEOUT_DAYS,
  IDLE_TIMEOUT_MS,
  ABSOLUTE_EXPIRY_MS,
  isHttpsRequest,
  authCookieOptions,
};
