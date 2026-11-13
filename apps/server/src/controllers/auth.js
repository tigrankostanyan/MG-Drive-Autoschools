const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("../utils/Email");
const Validator = require("../utils/validation");
const { safePasswordCompare } = require("../utils/timingSafe");
const {
  hashPassword,
  needsRehash,
  passwordPolicyProblems,
} = require("../utils/password");
const sessionManager = require("../utils/sessionManager");
const { publicUrl } = require("../utils/publicUrl");
const {
  createSessionAndSetCookies,
  clearSessionCookies,
  invalidateSession,
  revokeAllUserSessions,
  getSessionFromCookies,
} = require("../lib/session");
const { logSecurityEvent, EVENT } = require("../utils/securityLogger");
const DB = require("../models");
const { User, StudentGroup } = DB.models;
const { Op } = DB.Sequelize;
let googleClient = null;
function getGoogleClient() {
  if (googleClient) return googleClient;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;
  googleClient = new OAuth2Client(clientId);
  return googleClient;
}
let googleCodeClient = null;
function getGoogleCodeClient() {
  if (googleCodeClient) return googleCodeClient;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  googleCodeClient = new OAuth2Client(clientId, clientSecret, "postmessage");
  return googleCodeClient;
}
// Safe user DTO: never expose internal security fields.
function safeUserDTO(user) {
  const dto = user.toJSON ? user.toJSON() : { ...user.get() };
  // Never leak these even if toJSON fails
  delete dto.password;
  delete dto.passwordResetToken;
  delete dto.passwordResetExpires;
  delete dto.login_token;
  delete dto.sessionVersion;
  delete dto.googleId;
  delete dto.disabledAt;
  delete dto.deleted;
  return dto;
}
function sendAuthResponse(
  res,
  req,
  { user, statusCode = 200, redirect = false },
) {
  if (redirect) {
    return res.redirect("/");
  }
  res.status(statusCode).json({
    status: "success",
    time: `${Date.now() - req.time} ms`,
    user: safeUserDTO(user),
    reload: true,
  });
}
exports.signUp = catchAsync(async (req, res, next) => {
  const validator = new Validator(req.body);
  validator
    .required("email", "Email")
    .email("email")
    .required("password", "Password")
    .min("password", 8, "Password")
    .required("phone", "Phone")
    .phone("phone")
    .required("name", "Name")
    .validate();
  // AUTH-02 password policy
  const policyProblems = passwordPolicyProblems(req.body.password);
  if (policyProblems.length > 0) {
    return next(new AppError(policyProblems.join(". "), 400, "WEAK_PASSWORD"));
  }
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: "user",
    });
    await createSessionAndSetCookies(user, req, res);
    logSecurityEvent(EVENT.LOGIN_SUCCESS, {
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      details: { method: "signup" },
      req,
    });
    sendAuthResponse(res, req, {
      user,
      statusCode: 201,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors?.[0]?.path;
      const msg =
        field === "phone"
          ? "Այս հեռախոսահամարն արդեն գրանցված է։"
          : "Այս էլ․ հասցեն արդեն գրանցված է։";
      const code = field === "phone" ? "PHONE_EXISTS" : "EMAIL_EXISTS";
      return next(new AppError(msg, 409, code));
    }
    if (err.name === "SequelizeValidationError") {
      const messages = err.errors.map((e) => e.message);
      return next(
        new AppError(
          `Validation Error: ${messages.join(". ")}`,
          400,
          "VALIDATION_ERROR",
        ),
      );
    }
    return next(err);
  }
});
exports.signUpByAdmin = catchAsync(async (req, res, next) => {
  try {
    const allowedRoles = ["user", "student", "team-member"];
    const role = String(req.body.role || "").trim();
    const name = String(req.body.name || "").trim();
    const lastName = String(req.body.last_name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const email = String(req.body.email || "").trim();
    const password = String(req.body.password || "").trim();
    if (!name || !phone || !email || !password || !role) {
      return next(new AppError("Պարտադիր դաշտերը բաց են մնացել", 403));
    }
    if (!allowedRoles.includes(role)) {
      return next(new AppError("Սխալ կարգավիճակ է ընտրվել", 403));
    }
    const adminPolicyProblems = passwordPolicyProblems(password);
    if (adminPolicyProblems.length > 0) {
      return next(
        new AppError(adminPolicyProblems.join(". "), 400, "WEAK_PASSWORD"),
      );
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return next(
        new AppError("Այս էլ․ հասցեն արդեն գրանցված է։", 409, "EMAIL_EXISTS"),
      );
    }
    const payload = {
      name: lastName ? `${name} ${lastName}` : name,
      phone,
      email,
      role,
      password,
    };
    const user = await User.create(payload);
    logSecurityEvent(EVENT.LOGIN_SUCCESS, {
      userId: req.user?.id,
      ip: req.ip,
      details: {
        method: "admin_signup",
        targetUser: user.id,
        targetEmail: email,
      },
      req,
    });
    res.status(201).json({
      status: "success",
      time: `${Date.now() - req.time} ms`,
      user: safeUserDTO(user),
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors?.[0]?.path;
      const msg =
        field === "phone"
          ? "Այս հեռախոսահամարն արդեն գրանցված է։"
          : "Այս էլ․ հասցեն արդեն գրանցված է։";
      const code = field === "phone" ? "PHONE_EXISTS" : "EMAIL_EXISTS";
      return next(new AppError(msg, 409, code));
    }
    if (err.name === "SequelizeValidationError") {
      const messages = err.errors.map((e) => {
        if (e.path === "phone")
          return "Հեռախոսահամարը պետք է լինի 0-ով սկսվող 9 նիշ (օր․ 091234567)";
        if (e.path === "email") return "Էլ․ հասցեն սխալ է";
        return e.message;
      });
      return next(
        new AppError(`${messages.join(". ")}`, 400, "VALIDATION_ERROR"),
      );
    }
    return next(err);
  }
});
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const validator = new Validator(req.body);
  validator.required("email").required("password").validate();
  const user = await User.findOne({ where: { email } });
  // Generic error: same message for a missing user or a wrong password.
  const authErr = new AppError("Սխալ էլ․ հասցե կամ գաղտնաբառ", 401);
  const userPassword = user ? user.password : null;
  const passwordValid = await safePasswordCompare(password, userPassword);
  if (!user || !passwordValid) {
    // Feed the per-(identifier, IP) lockout counter when the guard is mounted.
    req.recordLoginFailure?.();
    logSecurityEvent(
      EVENT.LOGIN_FAILURE,
      {
        userId: user?.id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: { email, reason: !user ? "user_not_found" : "wrong_password" },
        req,
      },
      "warn",
    );
    return next(authErr);
  }
  if (user.disabledAt) {
    logSecurityEvent(
      EVENT.LOGIN_FAILURE,
      {
        userId: user.id,
        ip: req.ip,
        details: { reason: "user_disabled" },
        req,
      },
      "warn",
    );
    return next(authErr);
  }
  // AUTH-02: migrate legacy bcrypt hashes to Argon2id in the background.
  if (needsRehash(user.password)) {
    hashPassword(password)
      .then((hash) =>
        User.update({ password: hash }, { where: { id: user.id } }),
      )
      .catch((err) =>
        console.error("[AUTH] background password rehash failed:", err.message),
      );
  }
  // MFA-enabled admins get a challenge token, not a session (AUTH-04).
  if (user.role === "admin" && user.mfaEnabledAt) {
    const mfaToken = sessionManager.createMfaChallengeToken(user);
    logSecurityEvent(EVENT.MFA_CHALLENGE_ISSUED, {
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      details: { reason: "password_accepted" },
      req,
    });
    // Password was correct, so reset the brute-force counter; MFA has its own.
    req.recordLoginSuccess?.();
    return res.status(200).json({ status: "mfa_required", mfaToken });
  }
  await createSessionAndSetCookies(user, req, res);
  logSecurityEvent(EVENT.LOGIN_SUCCESS, {
    userId: user.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    details: { method: "password" },
    req,
  });
  // Record success too: the row is part of the brute-force audit trail.
  req.recordLoginSuccess?.();
  sendAuthResponse(res, req, {
    user,
  });
});
// Verify Google ID token server-side, find or create user, create session
exports.googleAuth = catchAsync(async (req, res, next) => {
  const { credential, code } = req.body;
  if (!credential && !code) {
    return next(
      new AppError("Google credential or authorization code is required", 400),
    );
  }
  let payload;
  if (credential) {
    // Direct ID token verification (Google One Tap / implicit flow)
    const client = getGoogleClient();
    if (!client) {
      return next(new AppError("Google OAuth is not configured", 500));
    }
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      logSecurityEvent(
        EVENT.LOGIN_OAUTH_FAILURE,
        {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: { error: err.message },
          req,
        },
        "warn",
      );
      return next(new AppError("Google authentication failed", 401));
    }
  } else {
    // Authorization code exchange
    const client = getGoogleCodeClient();
    if (!client) {
      return next(new AppError("Google OAuth is not configured", 500));
    }
    try {
      const { tokens } = await client.getToken(code);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      logSecurityEvent(
        EVENT.LOGIN_OAUTH_FAILURE,
        {
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: { error: err.message },
          req,
        },
        "warn",
      );
      return next(new AppError("Google authentication failed", 401));
    }
  }
  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name || payload.given_name || "User";
  const picture = payload.picture || null;
  const emailVerified = payload.email_verified;
  if (!googleId || !email) {
    return next(new AppError("Invalid Google account data", 401));
  }
  if (!emailVerified) {
    logSecurityEvent(
      EVENT.LOGIN_OAUTH_FAILURE,
      {
        ip: req.ip,
        details: { googleId, reason: "email_not_verified" },
        req,
      },
      "warn",
    );
    return next(new AppError("Google account email is not verified", 401));
  }
  const allowedDomains = process.env.GOOGLE_ALLOWED_DOMAINS;
  if (allowedDomains) {
    const domain = email.split("@")[1];
    const allowed = allowedDomains.split(",").map((d) => d.trim());
    if (!allowed.includes(domain)) {
      return next(
        new AppError("This Google account domain is not allowed", 403),
      );
    }
  }
  let user = await User.findOne({
    where: { email },
    include: [
      { model: StudentGroup, as: "studentGroup" },
      { model: DB.models.File, as: "files" },
    ],
  });
  let isNewUser = false;
  if (user) {
    if (user.googleId && user.googleId !== googleId) {
      // Different Google account: possible account-linking attack.
      logSecurityEvent(
        EVENT.SUSPICIOUS_ACTIVITY,
        {
          userId: user.id,
          ip: req.ip,
          details: {
            existingGoogleId: user.googleId,
            attemptedGoogleId: googleId,
          },
          req,
        },
        "error",
      );
      return next(new AppError("Authentication failed", 401));
    }
    let shouldSave = false;
    if (!user.googleId) {
      user.googleId = googleId;
      shouldSave = true;
    }
    if (picture && user.avatar !== picture) {
      user.avatar = picture;
      shouldSave = true;
    }
    if (shouldSave) {
      await user.save({ validate: false });
      await user.reload();
    }
  } else {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture,
      password: randomPassword, // Random password — user never uses it
      phone: null,
      role: "user",
    });
    isNewUser = true;
  }
  if (user.disabledAt) {
    logSecurityEvent(
      EVENT.LOGIN_OAUTH_FAILURE,
      {
        userId: user.id,
        ip: req.ip,
        details: { reason: "user_disabled" },
        req,
      },
      "warn",
    );
    return next(new AppError("Account is disabled", 403));
  }
  await createSessionAndSetCookies(user, req, res);
  logSecurityEvent(EVENT.LOGIN_OAUTH_SUCCESS, {
    userId: user.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    details: { isNewUser },
    req,
  });
  res.status(isNewUser ? 201 : 200).json({
    status: "success",
    user: safeUserDTO(user),
  });
});
// Sessions are server-side double-cookie sessions now; there is no refresh
// token. This endpoint only reports whether the session is still alive.
exports.refreshToken = catchAsync(async (req, res, next) => {
  const session = await getSessionFromCookies(req);
  if (!session || !session.is_valid) {
    clearSessionCookies(res);
    return next(new AppError("Session expired", 401));
  }
  const user = await User.findByPk(session.user_id);
  if (!user || user.disabledAt) {
    clearSessionCookies(res);
    return next(new AppError("User not found or disabled", 401));
  }
  res.status(200).json({ status: "success", user: safeUserDTO(user) });
});
exports.logOut = catchAsync(async (req, res, next) => {
  // SPA double-cookie session
  const sessionToken = req.cookies?.session_token;
  if (sessionToken) {
    await invalidateSession(
      crypto.createHash("sha256").update(sessionToken).digest("hex"),
      "manual_logout",
    );
  }
  clearSessionCookies(res);
  logSecurityEvent(EVENT.LOGOUT, {
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    req,
  });
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.redirect("/");
  }
  res.status(200).json({
    status: "success",
    message: "Դուք դուրս եք եկել հաշվից",
    redirect: "/",
  });
});
exports.logoutAll = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Not authenticated", 401));
  }
  await revokeAllUserSessions(req.user.id, "manual_logout").catch(() => {});
  clearSessionCookies(res);
  logSecurityEvent(EVENT.LOGOUT_ALL, {
    userId: req.user.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    req,
  });
  res.status(200).json({
    status: "success",
    message: "Բոլոր սեսիաները դադարեցվել են",
  });
});
// Returns current authenticated user; verifies token is still valid
exports.safeUserDTO = safeUserDTO;
exports.getMe = catchAsync(async (req, res, next) => {
  // Re-verify server-authoritative state
  const user = await User.findByPk(req.user.id, {
    include: [
      { model: StudentGroup, as: "studentGroup" },
      { model: DB.models.File, as: "files" },
    ],
  });
  if (!user || user.disabledAt) {
    clearSessionCookies(res);
    return res
      .status(401)
      .json({ status: "fail", message: "User not found or disabled" });
  }
  res.status(200).json({
    status: "success",
    user: safeUserDTO(user),
  });
});
// Verifies the session, then loads req.user from DB
exports.protect = catchAsync(async (req, res, next) => {
  if (req.cookies?.session_token) {
    const { authenticate } = require("../middleware/authenticate");
    return authenticate(req, res, next);
  }
  if (req.originalUrl?.startsWith("/api")) {
    return next(new AppError("Խնդրում ենք մուտք գործել", 401));
  }
  return res.redirect("/");
});
// Soft auth: populates req.user when the session is valid, never blocks.
exports.isLoggedIn = async (req, res, next) => {
  res.locals.user = undefined;
  if (req.cookies?.session_token) {
    try {
      const session = await getSessionFromCookies(req);
      if (session && session.is_valid) {
        const user = await User.findByPk(session.user_id);
        if (user && !user.disabledAt) {
          req.user = user;
          res.locals.user = safeUserDTO(user);
        }
      }
    } catch {
    }
  }
  next();
};
// Restrict access to specific roles (role loaded from DB, never JWT payload)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }
    if (!roles.includes(req.user.role)) {
      logSecurityEvent(
        EVENT.ADMIN_ACCESS_DENIED,
        {
          userId: req.user.id,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          details: { requiredRoles: roles, userRole: req.user.role },
          req,
        },
        "warn",
      );
      return next(
        new AppError(
          "Դուք իրավասություն չունեք կատարելու այս գործողությունը",
          403,
        ),
      );
    }
    next();
  };
};

// Redirect already-logged-in users away from auth pages
exports.protectUser = (req, res, next) => {
  if (res.locals.user) {
    return res.redirect("/");
  }
  next();
};
exports.disableUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (user.role === "admin") {
    return next(new AppError("Cannot disable admin users", 403));
  }
  user.disabledAt = new Date();
  user.sessionVersion = (user.sessionVersion || 0) + 1;
  user.login_token = null;
  await user.save({ validateBeforeSave: false });
  await revokeAllUserSessions(user.id, "admin_action");
  logSecurityEvent(EVENT.USER_DISABLED, {
    userId: req.user.id,
    ip: req.ip,
    details: { targetUser: user.id, targetEmail: user.email },
    req,
  });
  res.status(200).json({
    status: "success",
    message: "User has been disabled",
  });
});
// Forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Խնդրում ենք տրամադրել ձեր էլ. փոստը։", 400));
  }
  const user = await User.findOne({ where: { email } });
  // Prevent email enumeration.
  if (!user) {
    // Still delay to prevent timing-based enumeration
    await new Promise((resolve) => setTimeout(resolve, 500));
    return res.status(200).json({
      status: "success",
      message:
        "Եթե այս էլ. հասցեով գրանցում կա, ապա վերականգնման կոդը կուղարկվի։",
    });
  }
  const resetToken = user.createPasswordResetToken();
  await user.save();
  try {
    const resetURL = publicUrl(`/resetPassword/${resetToken}`);
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Վերականգնման կոդն ուղարկել ենք էլ. հասցեին",
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 401));
  }
  const resetPolicyProblems = passwordPolicyProblems(req.body.password);
  if (resetPolicyProblems.length > 0) {
    return next(
      new AppError(resetPolicyProblems.join(". "), 400, "WEAK_PASSWORD"),
    );
  }
  user.password = req.body.password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  // sessionVersion will be incremented by the beforeSave hook, revoking all sessions
  await user.save();
  await revokeAllUserSessions(user.id, "password_changed");
  logSecurityEvent(EVENT.PASSWORD_CHANGED, {
    userId: user.id,
    ip: req.ip,
    details: { method: "reset" },
    req,
  });
  res.status(200).json({
    status: "success",
    message: "Գաղտնաբառը հաջողությամբ վերականգնվեց",
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id", "password", "login_token", "role", "sessionVersion"],
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const passwordCorrect = await user.correctPassword(req.body.passwordCurrent);
  if (!passwordCorrect) {
    logSecurityEvent(
      EVENT.LOGIN_FAILURE,
      {
        userId: user.id,
        ip: req.ip,
        details: {
          reason: "wrong_current_password",
          action: "update_password",
        },
        req,
      },
      "warn",
    );
    return next(new AppError("Ընթացիկ գաղտնաբառը սխալ է", 401));
  }
  const updatePolicyProblems = passwordPolicyProblems(req.body.password);
  if (updatePolicyProblems.length > 0) {
    return next(
      new AppError(updatePolicyProblems.join(". "), 400, "WEAK_PASSWORD"),
    );
  }
  user.password = req.body.password;
  await user.save();
  await revokeAllUserSessions(user.id, "password_changed");
  logSecurityEvent(EVENT.PASSWORD_CHANGED, {
    userId: user.id,
    ip: req.ip,
    details: { method: "user_update" },
    req,
  });
  await createSessionAndSetCookies(user, req, res);
  sendAuthResponse(res, req, {
    user,
  });
});