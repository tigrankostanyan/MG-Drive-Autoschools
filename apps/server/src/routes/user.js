const router = require("express").Router();
const {
  loginLimiter,
  refreshLimiter,
  googleAuthLimiter,
  csrfTokenLimiter,
  signUpLimiter,
  resetPasswordLimiter,
  forgotPasswordLimiter,
} = require("../utils/limiter");
const { loginAttemptGuard } = require("../middleware/rateLimiter");
const security = require("../security");
const ctrls = require("../controllers");
const { safeUserDTO } = ctrls.auth;
const {
  authenticate,
  requireRole,
  requireStepUp,
} = require("../middleware/authenticate");

// Bridge: populate res.locals.user after authenticate, with all security
function populateLocals(req, res, next) {
  if (req.user) {
    res.locals.user = safeUserDTO(req.user);
  }
  next();
}

// CSRF token endpoint; uses the shared limiter so the 429 body matches.
router.get(
  "/csrf-token",
  csrfTokenLimiter,
  security.generateCsrfToken,
  (req, res) => {
    res.status(200).json({
      status: "success",
      csrfToken: res.locals.csrfToken,
    });
  },
);
router.use(ctrls.auth.isLoggedIn);
router.post(
  "/signUp",
  signUpLimiter,
  security.csrfProtection,
  ctrls.auth.protectUser,
  ctrls.auth.signUp,
);
// Sign in: IP attempt cap plus per-(email, IP) failure lockout.
router.post(
  "/signIn",
  security.csrfProtection,
  ctrls.auth.protectUser,
  loginLimiter,
  loginAttemptGuard("body.email"),
  ctrls.auth.signIn,
);
router.post(
  "/auth/google",
  security.csrfProtection,
  googleAuthLimiter,
  ctrls.auth.googleAuth,
);
router.post(
  "/forgotPassword",
  forgotPasswordLimiter,
  security.csrfProtection,
  ctrls.auth.protectUser,
  ctrls.auth.forgotPassword,
);
router.post(
  "/resetPassword/:token",
  resetPasswordLimiter,
  security.csrfProtection,
  ctrls.auth.resetPassword,
);
// Token refresh: also requires the double-submit CSRF token.
router.post(
  "/token",
  security.csrfProtection,
  refreshLimiter,
  ctrls.auth.refreshToken,
);
router.get("/me", authenticate, populateLocals, ctrls.auth.getMe);
router.patch(
  "/updateMyPassword",
  security.csrfProtection,
  authenticate,
  populateLocals,
  ctrls.auth.updatePassword,
);
router.patch(
  "/updateme",
  security.csrfProtection,
  authenticate,
  populateLocals,
  ctrls.user.updateMe,
);
router.delete(
  "/avatar",
  security.csrfProtection,
  authenticate,
  populateLocals,
  ctrls.user.deleteAvatar,
);
router.post(
  "/logout",
  security.csrfProtection,
  authenticate,
  populateLocals,
  ctrls.auth.logOut,
);
router.post(
  "/logout-all",
  security.csrfProtection,
  authenticate,
  populateLocals,
  ctrls.auth.logoutAll,
);
router.get(
  "/",
  authenticate,
  populateLocals,
  requireRole("admin"),
  ctrls.user.getUsers,
);
router.post(
  "/signUpByAdmin",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  ctrls.auth.signUpByAdmin,
);
router.patch(
  "/reorder",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  ctrls.user.reorderUsers,
);
// Demotes or changes another account: requires a recent MFA step-up.
router.patch(
  "/:id",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  requireStepUp(15),
  ctrls.user.updateUser,
);
router.delete(
  "/:id",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  requireStepUp(15),
  ctrls.user.deleteUser,
);
router.post(
  "/:id/disable",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  requireStepUp(15),
  ctrls.auth.disableUser,
);
// MFA management (admin-only); mounted after /:id, which cannot shadow it.
router.get(
  "/mfa/status",
  authenticate,
  populateLocals,
  requireRole("admin"),
  ctrls.mfa.status,
);
router.post(
  "/mfa/enroll",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  ctrls.mfa.enroll,
);
router.post(
  "/mfa/verify",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  ctrls.mfa.verify,
);
router.post(
  "/mfa/disable",
  security.csrfProtection,
  authenticate,
  populateLocals,
  requireRole("admin"),
  ctrls.mfa.disable,
);
router.post(
  "/reset-tests",
  security.csrfProtection,
  authenticate,
  populateLocals,
  ctrls.user.resetTests,
);
router.post(
  "/reset-groups",
  security.csrfProtection,
  authenticate,
  populateLocals,
  ctrls.user.resetGroups,
);
module.exports = router;