const timeout = require("connect-timeout");
const TIMEOUT_MS = 30000;
const timeoutHandler = timeout(TIMEOUT_MS, {
  respond: true,
  message: "Request timeout - operation took too long",
});
const timeoutErrorHandler = (req, res, next) => {
  if (req.timedout) {
    return res.status(503).json({
      status: "error",
      code: "REQUEST_TIMEOUT",
      message: "Service unavailable - request timed out",
    });
  }
  next();
};
const configureServerTimeout = (server) => {
  server.timeout = TIMEOUT_MS + 5000; // 5 seconds buffer
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
  return server;
};
module.exports = {
  timeoutHandler,
  timeoutErrorHandler,
  configureServerTimeout,
  TIMEOUT_MS,
};
