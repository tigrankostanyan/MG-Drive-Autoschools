const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
const { reviewLimiter } = require("../utils/limiter");
router.get("/", ctrls.review.getReviews);
router.post(
  "/",
  security.csrfProtection,
  reviewLimiter,
  ctrls.auth.isLoggedIn,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("student", "admin", "user"),
  ctrls.review.addReview,
);
router.patch(
  "/:id",
  security.csrfProtection,
  ctrls.auth.isLoggedIn,
  ctrls.auth.protect,
  ctrls.review.updateReview,
);
module.exports = router;
