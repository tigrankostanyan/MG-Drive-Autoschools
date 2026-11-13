const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
router
  .route("/")
  .post(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.test.addTest,
  )
  .get(
    ctrls.test.getTests,
  );

// Test session streaming endpoints
router.post(
  "/session",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("student", "admin"),
  ctrls.test.createSession,
);
router.get(
  "/session/:sessionId",
  ctrls.auth.protect,
  ctrls.auth.restrictTo("student", "admin"),
  ctrls.test.getSession,
);
router.get(
  "/session/:sessionId/question/:questionIndex",
  ctrls.auth.protect,
  ctrls.auth.restrictTo("student", "admin"),
  ctrls.test.fetchQuestion,
);
router.post(
  "/session/:sessionId/submit",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("student", "admin"),
  ctrls.test.submitSession,
);
router.delete(
  "/session/:sessionId",
  ctrls.auth.protect,
  ctrls.auth.restrictTo("student", "admin"),
  ctrls.test.cancelSession,
);

router
  .route("/:id")
  .get(
    ctrls.auth.isLoggedIn,
    ctrls.test.getTest,
  )
  .patch(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.test.updateTest,
  )
  .delete(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.test.deleteTest,
  );
module.exports = router;
