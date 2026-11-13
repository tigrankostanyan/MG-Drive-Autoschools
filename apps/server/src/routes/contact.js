const router = require("express").Router();
const ctrls = require("../controllers");
const security = require("../security");
const { contactLimiter } = require("../utils/limiter");
router
  .route("/")
  .get(ctrls.contact.getContacts)
  .patch(
    security.csrfProtection,
    ctrls.auth.protect,
    ctrls.auth.restrictTo("admin"),
    ctrls.contact.updateContacts,
  );
router.post(
  "/message",
  security.csrfProtection,
  contactLimiter,
  ctrls.contact.createMessage,
);
router.post(
  "/subscribe",
  security.csrfProtection,
  contactLimiter,
  ctrls.contact.subscribe,
);
router.get(
  "/message",
  ctrls.auth.isLoggedIn,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.contact.getMessages,
);
router.delete(
  "/message/:id",
  security.csrfProtection,
  ctrls.auth.isLoggedIn,
  ctrls.auth.protect,
  ctrls.auth.restrictTo("admin"),
  ctrls.contact.deleteMessage,
);
module.exports = router;
