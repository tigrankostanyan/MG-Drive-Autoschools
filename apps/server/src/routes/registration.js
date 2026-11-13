const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
const { registrationLimiter } = require("../utils/limiter");
router
  .route("/")
  .post(
    security.csrfProtection,
    registrationLimiter,
    ctrls.registration.createRegistration,
  )
  .get(
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.registration.getRegistration,
  );
router
  .route("/:id")
  .delete(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.registration.deleteRegistration,
  );
module.exports = router;
