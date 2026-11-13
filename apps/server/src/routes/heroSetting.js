const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");

router.get("/", ctrls.heroSetting.getHeroSettings);

router.put(
  "/",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.heroSetting.updateHeroSettings
);

module.exports = router;
