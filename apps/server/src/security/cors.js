const cors = require("cors");
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In development, allow additional localhost ports
    if (
      process.env.NODE_ENV !== "production" &&
      origin.startsWith("http://localhost")
    ) {
      return callback(null, true);
    }
    // In production, STRICTLY reject non-whitelisted origins
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["X-CSRF-Token"],
  maxAge: 86400,
};
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      code: "CORS_ERROR",
      message: "Origin not allowed",
    });
  }
  next(err);
};
module.exports = {
  cors: cors(corsOptions),
  corsErrorHandler,
  corsOptions,
};
