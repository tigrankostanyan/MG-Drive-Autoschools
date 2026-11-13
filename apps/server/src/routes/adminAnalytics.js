const router = require("express").Router();
const ctrls = require("../controllers");
const { authenticate, requireRole } = require("../middleware/authenticate");

router.get(
  "/",
  authenticate,
  requireRole("admin"),
  ctrls.admin_analytics.getDashboardAnalytics,
);

router.get(
  "/students",
  authenticate,
  requireRole("admin"),
  ctrls.admin_analytics.getStudentAnalytics,
);

router.patch(
  "/students/:id/toggle",
  authenticate,
  requireRole("admin"),
  ctrls.admin_analytics.toggleStudentAnalytics,
);

router.post(
  "/students/bulk-toggle",
  authenticate,
  requireRole("admin"),
  ctrls.admin_analytics.bulkToggleStudentAnalytics,
);

module.exports = router;

