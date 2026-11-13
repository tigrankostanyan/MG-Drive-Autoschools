const { Router } = require("express");
const ctrls = require("../controllers");
const security = require("../security");
const router = Router();
router
  .route("/:id")
  .delete(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.image.deleteImage,
  );
module.exports = router;
