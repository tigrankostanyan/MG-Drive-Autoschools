const csrf = require("./csrf");
const cors = require("./cors");
const helmet = require("./helmet");
const timeout = require("./timeout");
const sanitize = require("./sanitize");
const trustProxy = require("./trustProxy");
module.exports = {
  csrfProtection: csrf.csrfProtection,
  csrfErrorHandler: csrf.csrfErrorHandler,
  generateCsrfToken: csrf.generateCsrfToken,
  cors: cors.cors,
  corsErrorHandler: cors.corsErrorHandler,
  corsOptions: cors.corsOptions,
  helmet,
  timeoutHandler: timeout.timeoutHandler,
  timeoutErrorHandler: timeout.timeoutErrorHandler,
  configureServerTimeout: timeout.configureServerTimeout,
  TIMEOUT_MS: timeout.TIMEOUT_MS,
  mongoSanitize: sanitize.mongoSanitize,
  xss: sanitize.xss,
  hpp: sanitize.hpp,
  sanitizeBody: sanitize.sanitizeBody,
  preventPrototypePollution: sanitize.preventPrototypePollution,
  trustProxy: trustProxy.trustProxy,
  getClientIP: trustProxy.getClientIP,
  isPrivateIP: trustProxy.isPrivateIP,
};
