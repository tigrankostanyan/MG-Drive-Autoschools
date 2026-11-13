const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
router
  .route("/")
  .get(
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.question.getQuestions,
  )
  .post(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.question.addQuestion,
  );
router.post(
  "/reorder",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.question.reorderQuestions,
);
router
  .route("/:id")
  .patch(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.question.updateQuestion,
  )
  .delete(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.question.deleteQuestion,
  );
router.delete(
  "/:id/image",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.question.deleteQuestionImage,
);
module.exports = router;
