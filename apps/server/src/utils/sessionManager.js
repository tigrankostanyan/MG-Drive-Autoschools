// Pre-auth MFA challenge tokens only (AUTH-04).
// Browser sessions are MySQL-backed double-cookie sessions; see src/lib/session.js.
// No access/refresh JWTs are issued here anymore.
const jwt = require("jsonwebtoken");
const DB = require("../models");
const { User } = DB.models;

// Distinct audience and short TTL keep challenge tokens from being usable as sessions.
const MFA_CHALLENGE_AUDIENCE = "mg-drive-mfa";
const MFA_CHALLENGE_EXPIRY_MINUTES = 5;

function validateSecrets() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment");
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }
  const WEAK_SECRETS = [
    "secret",
    "jwt_secret",
    "my-secret",
    "your-secret",
    "test",
    "dev-secret",
  ];
  if (WEAK_SECRETS.includes(secret.toLowerCase())) {
    throw new Error(
      "JWT_SECRET is a weak/default value. Must be changed for production.",
    );
  }
  return secret;
}

// AUTH-04 challenge tokens: not access tokens, distinct audience, 5-minute TTL.
function createMfaChallengeToken(user) {
  const secret = validateSecrets();
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      sv: user.sessionVersion || 0, // bound to the session generation
      type: "mfa_challenge",
    },
    secret,
    {
      expiresIn: `${MFA_CHALLENGE_EXPIRY_MINUTES}m`,
      audience: MFA_CHALLENGE_AUDIENCE,
      issuer: "mg-drive-auth",
    },
  );
}

async function verifyMfaChallengeToken(token) {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "missing" };
  }
  const secret = validateSecrets();
  let decoded;
  try {
    decoded = jwt.verify(token, secret, {
      audience: MFA_CHALLENGE_AUDIENCE,
      issuer: "mg-drive-auth",
      algorithms: ["HS256"],
    });
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return { valid: false, reason: "expired" };
    }
    return { valid: false, reason: "invalid" };
  }
  if (decoded.type !== "mfa_challenge") {
    return { valid: false, reason: "invalid_type" };
  }
  const user = await User.findByPk(decoded.id);
  if (!user) return { valid: false, reason: "user_not_found" };
  if (user.disabledAt) return { valid: false, reason: "user_disabled" };
  if (user.deleted) return { valid: false, reason: "user_deleted" };
  if (!user.mfaEnabledAt) return { valid: false, reason: "mfa_not_enabled" };
  if (decoded.sv !== undefined && user.sessionVersion !== decoded.sv) {
    return { valid: false, reason: "session_version_mismatch" };
  }
  return { valid: true, user };
}

module.exports = {
  MFA_CHALLENGE_AUDIENCE,
  MFA_CHALLENGE_EXPIRY_MINUTES,
  validateSecrets,
  createMfaChallengeToken,
  verifyMfaChallengeToken,
};