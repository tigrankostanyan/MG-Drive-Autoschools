const sanitizeHtml = require("sanitize-html");
const hpp = require("hpp");
// Custom MongoDB NoSQL Injection Prevention (without deprecated package)
const mongoSanitizeMiddleware = (req, res, next) => {
  const sanitize = (obj, path = "") => {
    if (!obj || typeof obj !== "object") return obj;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("$")) {
        console.warn(`[Security] Removed MongoDB operator: ${key}`);
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key], `${path}.${key}`);
      }
    });
    return obj;
  };
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};
const sanitizeXss = (value) => {
  if (typeof value !== "string") return value;
  return sanitizeHtml(value, {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {},
    textFilter: (text) => text,
  });
};
const xssMiddleware = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        obj[key] = sanitizeXss(obj[key]);
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    });
    return obj;
  };
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};
const hppOptions = {
  whitelist: [
    "sort",
    "fields",
    "role",
    "status",
  ],
};
const hppMiddleware = hpp(hppOptions);
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("$")) {
        delete req.body[key];
      }
    });
  }
  next();
};
const preventPrototypePollution = (req, res, next) => {
  const forbiddenKeys = ["__proto__", "constructor", "prototype"];
  const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        if (forbiddenKeys.includes(key)) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          sanitize(obj[key]);
        }
      });
    }
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};
module.exports = {
  mongoSanitize: mongoSanitizeMiddleware,
  xss: xssMiddleware,
  hpp: hppMiddleware,
  sanitizeBody,
  preventPrototypePollution,
};
