const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");

router.route("/")
  .post(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.group.addGroup,
  )
  .get(
    ctrls.group.getGroups,
  );
router.get(
  "/metadata",
  ctrls.group.getGroupMetadata,
);

router.post(
  "/submit",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.group.submitResult,
);

router.delete(
  "/:id/results",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.group.resetResults,
);

router.get(
  "/:id/progress",
  ctrls.auth.protect,
  ctrls.group.getProgress,
);

router.post(
  "/:id/progress",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.group.saveProgress,
);

router.get(
  "/:id/questions",
  ctrls.auth.protect,
  ctrls.group.getGroupQuestions,
);

router.post(
  "/:id/check",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.group.checkGroupAnswers,
);

router.patch(
  "/reorder",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.group.reorderGroups,
);
router.route("/:id")
  .get(
    ctrls.auth.isLoggedIn,
    ctrls.group.getGroup,
  )
  .patch(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.group.updateGroup,
  )
  .delete(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.group.deleteGroup,
  );
  
module.exports = router;
