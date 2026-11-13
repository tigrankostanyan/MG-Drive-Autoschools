"use strict";
// TOTP multi-factor authentication (AUTH-04).
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sessionManager = require("../utils/sessionManager");
const totp = require("../utils/totp");
const { logSecurityEvent, EVENT } = require("../utils/securityLogger");

const ISSUER = "MG Drive Autoschools";
const RECOVERY_CODE_COUNT = 10;

// Unparseable recovery-code hashes mean "none", never a mid-challenge throw.
function parseRecoveryHashes(user) {
  if (!user.mfaRecoveryCodeHashes) return [];
  try {
    const parsed = JSON.parse(user.mfaRecoveryCodeHashes);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

exports.status = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    enabled: Boolean(req.user.mfaEnabledAt),
    enrolledAt: req.user.mfaEnabledAt || null,
  });
});

// POST /mfa/enroll: mint a pending secret; nothing locks out before verify.
exports.enroll = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (user.mfaEnabledAt) {
    return next(
      new AppError(
        "MFA is already enabled. Disable it before re-enrolling.",
        409,
        "MFA_ALREADY_ENABLED",
      ),
    );
  }

  const secret = totp.generateSecret();
  user.mfaSecret = secret;
  user.mfaEnabledAt = null;
  await user.save({ fields: ["mfaSecret", "mfaEnabledAt"] });

  const otpauthUri = totp.buildOtpAuthUri({
    secret,
    accountName: user.email,
    issuer: ISSUER,
  });

  logSecurityEvent(EVENT.MFA_ENROLLED, {
    userId: user.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    details: { stage: "pending" },
    req,
  });

  res.status(200).json({
    status: "success",
    secret,
    otpauthUri,
  });
});

// POST /mfa/verify: recovery codes are returned exactly once, hashed on disk.
exports.verify = catchAsync(async (req, res, next) => {
  const user = req.user;
  const token = String(req.body?.token || req.body?.code || "");

  if (!user.mfaSecret) {
    return next(
      new AppError(
        "No pending MFA enrollment was found. Start enrollment first.",
        400,
        "MFA_NOT_ENROLLED",
      ),
    );
  }

  const { valid } = totp.verifyTotp(user.mfaSecret, token);
  if (!valid) {
    logSecurityEvent(
      EVENT.MFA_ENROLLMENT_FAILED,
      {
        userId: user.id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: { reason: "invalid_code" },
        req,
      },
      "warn",
    );
    return next(
      new AppError(
        "The verification code is invalid or has expired.",
        400,
        "MFA_INVALID_CODE",
      ),
    );
  }

  const codes = totp.generateRecoveryCodes(RECOVERY_CODE_COUNT);
  const now = new Date();
  user.mfaEnabledAt = now;
  // Enrollment counts as a fresh confirmation, so setup does not hit step-up.
  user.mfaVerifiedAt = now;
  user.mfaRecoveryCodeHashes = JSON.stringify(codes.map((c) => c.hash));
  await user.save({
    fields: ["mfaEnabledAt", "mfaVerifiedAt", "mfaRecoveryCodeHashes"],
  });

  logSecurityEvent(EVENT.MFA_ENROLLED, {
    userId: user.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    details: { stage: "active", recoveryCodes: codes.length },
    req,
  });

  res.status(200).json({
    status: "success",
    enabled: true,
    enrolledAt: now,
    // Shown once; the client must present these to the user immediately.
    recoveryCodes: codes.map((c) => c.code),
  });
});

// POST /mfa/disable: needs both the account password and a current TOTP code.
exports.disable = catchAsync(async (req, res, next) => {
  const user = req.user;
  const password = String(req.body?.password || "");
  const token = String(req.body?.token || req.body?.code || "");

  const passwordValid = await user.correctPassword(password);
  if (!passwordValid) {
    logSecurityEvent(
      EVENT.MFA_ENROLLMENT_FAILED,
      {
        userId: user.id,
        ip: req.ip,
        details: { action: "disable", reason: "invalid_password" },
        req,
      },
      "warn",
    );
    return next(
      new AppError("The password is incorrect.", 401, "MFA_INVALID_PASSWORD"),
    );
  }

  const { valid } = totp.verifyTotp(user.mfaSecret, token);
  if (!valid) {
    return next(
      new AppError(
        "The verification code is invalid or has expired.",
        400,
        "MFA_INVALID_CODE",
      ),
    );
  }

  user.mfaSecret = null;
  user.mfaEnabledAt = null;
  user.mfaRecoveryCodeHashes = null;
  user.mfaVerifiedAt = null;
  await user.save({
    fields: [
      "mfaSecret",
      "mfaEnabledAt",
      "mfaRecoveryCodeHashes",
      "mfaVerifiedAt",
    ],
  });

  logSecurityEvent(EVENT.MFA_DISABLED, {
    userId: user.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    req,
  });

  res.status(200).json({ status: "success", enabled: false });
});

// POST /auth/mfa/challenge: the only place an MFA admin gets a session.
exports.challenge = catchAsync(async (req, res, next) => {
  const mfaToken = req.body?.mfaToken;
  const token = String(req.body?.token || req.body?.code || "");
  const recoveryCode = req.body?.recoveryCode
    ? String(req.body.recoveryCode)
    : "";

  const result = await sessionManager.verifyMfaChallengeToken(mfaToken);
  if (!result.valid) {
    logSecurityEvent(
      EVENT.MFA_CHALLENGE_FAILURE,
      {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: { reason: result.reason },
        req,
      },
      "warn",
    );
    return next(
      new AppError(
        "The multi-factor challenge is invalid or has expired. Please sign in again.",
        401,
        "MFA_CHALLENGE_INVALID",
      ),
    );
  }

  const user = result.user;
  let verified = false;
  let usedRecoveryIndex = -1;

  if (recoveryCode) {
    const hashes = parseRecoveryHashes(user);
    const match = totp.verifyRecoveryCode(recoveryCode, hashes);
    if (match.valid) {
      verified = true;
      usedRecoveryIndex = match.index;
    }
  } else {
    verified = totp.verifyTotp(user.mfaSecret, token).valid;
  }

  if (!verified) {
    logSecurityEvent(
      EVENT.MFA_CHALLENGE_FAILURE,
      {
        userId: user.id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: {
          reason: recoveryCode ? "invalid_recovery_code" : "invalid_code",
        },
        req,
      },
      "warn",
    );
    return next(
      new AppError(
        "The verification code is invalid or has expired.",
        401,
        "MFA_INVALID_CODE",
      ),
    );
  }

  // Drop the matched hash before issuing the session; codes are single-use.
  if (usedRecoveryIndex !== -1) {
    const hashes = parseRecoveryHashes(user);
    hashes.splice(usedRecoveryIndex, 1);
    user.mfaRecoveryCodeHashes = hashes.length ? JSON.stringify(hashes) : null;
    logSecurityEvent(
      EVENT.MFA_RECOVERY_CODE_USED,
      {
        userId: user.id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: { remaining: hashes.length },
        req,
      },
      "warn",
    );
  }

  user.mfaVerifiedAt = new Date();
  await user.save({ fields: ["mfaVerifiedAt", "mfaRecoveryCodeHashes"] });

  await require("../lib/session").createSessionAndSetCookies(user, req, res);

  logSecurityEvent(EVENT.MFA_CHALLENGE_SUCCESS, {
    userId: user.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    details: { method: recoveryCode ? "recovery_code" : "totp" },
    req,
  });

  res.status(200).json({
    status: "success",
    user: user.toJSON(),
    reload: true,
  });
});
