const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
router
  .route("/")
  .post(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.gallery.addGallery,
  )
  .get(ctrls.gallery.getGalleries);
router
  .route("/:id")
  .patch(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.gallery.updateGallery,
  )
  .delete(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.gallery.deleteGallery,
  );
module.exports = router;
