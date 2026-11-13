const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
const { authenticate, requireRole } = require("../middleware/authenticate");

router.get(
  "/",
  authenticate,
  requireRole("admin"),
  ctrls.adminMenu.getMenuItems,
);

router.patch(
  "/reorder",
  security.csrfProtection,
  authenticate,
  requireRole("admin"),
  ctrls.adminMenu.reorderMenuItems,
);

module.exports = router;
