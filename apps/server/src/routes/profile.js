const router = require("express").Router();
const ctrls = require("../controllers");
router.use(ctrls.auth.protect);
router.get("/", ctrls.profile.getProfile);
router.get("/results", ctrls.profile.getResults);
router.get("/wrong-answers", ctrls.profile.getWrongAnswers);
router.get("/progress", ctrls.profile.getProgress);
module.exports = router;
