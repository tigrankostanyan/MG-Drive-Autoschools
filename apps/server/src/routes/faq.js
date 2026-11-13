const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
router.get("/", ctrls.faq.getFaqs);
router.post(
  "/",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.faq.addFaq,
);
router.get("/categories", ctrls.faq.getFaqCategories);
router.put(
  "/categories",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.faq.updateFaqCategories,
);
router.patch(
  "/:id",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.faq.updateFaq,
);
router.delete(
  "/:id",
  security.csrfProtection,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.faq.deleteFaq,
);
module.exports = router;
