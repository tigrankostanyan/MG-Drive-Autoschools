 const path = require("path");
const dotenv = require("dotenv");
const crypto = require("crypto");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
process.env.UV_THREADPOOL_SIZE = 32;
const fileUpload = require("express-fileupload");
dotenv.config({ path: path.join(__dirname, ".env"), override: !process.env.RUNNING_IN_DOCKER });
const security = require("./src/security");
const redis = require("./src/utils/redisClient");
const Server = require("./src/utils/server");
const Api = require("./src/utils/api");
const limiters = require("./src/utils/limiter");
const ipBlacklist = require("./src/middleware/ipBlacklist");
const ctrls = require("./src/controllers");
const globalErrorHandler = ctrls.error;
const metrics = require("./src/utils/metrics");
const AppError = require("./src/utils/appError");
const DB = require("./src/models");
const { Contact } = DB.models;
const app = express();
app.disable("x-powered-by");

app.set("trust proxy", security.trustProxy());

// Reject IPs that have been auto-blocked for abusive behaviour.
app.use(ipBlacklist.ipBlockGuard);

app.use(security.helmet);
app.use(security.cors);
app.use(security.corsErrorHandler);

app.use(
  compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

const staticOptions = {
  etag: true,
  maxAge: "1y",
  immutable: true,
  setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
};

app.use(
  "/admin",
  express.static(path.join(__dirname, "public", "admin"), staticOptions),
);

app.use(express.static(path.join(__dirname, "public"), staticOptions));
app.use(metrics.middleware);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(security.mongoSanitize);
app.use(security.xss);
app.use(security.hpp);
app.use(security.sanitizeBody);
app.use(security.preventPrototypePollution);
app.set("etag", "strong");
app.use(cookieParser());

app.use(require("method-override")("_method"));

// Must run after the cookie parser.
app.use(security.generateCsrfToken);
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true,
    limitHandler: (req, res) => {
      if (!res.headersSent) {
        res.status(413).json({
          status: "fail",
          code: "FILE_TOO_LARGE",
          message: "File is too large. Maximum size is 10 MB.",
        });
      }
    },
  }),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Rate tiers
app.use("/api", limiters.apiLimiter);
// Reject known bots/scanners on the API and record abuse for auto-blocking.
app.use("/api", require("./src/middleware/rateLimiter").botDetector);

app.use((req, res, next) => {
  req.time = Date.now();
  next();
});

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) res.set("Cache-Control", "no-store");
  next();
});

app.use((req, res, next) => {
  if (
    !redis ||
    req.originalUrl.startsWith("/api") ||
    req.originalUrl.startsWith("/admin") ||
    !req.accepts("html")
  ) {
    return next();
  }
  const dateKey = new Date().toISOString().slice(0, 10);
  const ip = req.ip || "";
  const ua = req.headers["user-agent"] || "";
  const fingerprint = crypto
    .createHash("sha256")
    .update(`${ip}|${ua}`)
    .digest("hex");
  redis.sAdd(`visitors:${dateKey}`, fingerprint).catch(() => { });
  redis.incr(`visits:${dateKey}`).catch(() => { });
  redis.expire(`visitors:${dateKey}`, 3 * 24 * 60 * 60).catch(() => { });
  redis.expire(`visits:${dateKey}`, 3 * 24 * 60 * 60).catch(() => { });
  next();
});

app.use(security.timeoutHandler);
app.use(security.timeoutErrorHandler);

Api(app);

app.use(security.csrfErrorHandler);

app.all("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api"))
    return next(
      new AppError(
        `Հնարավոր չէ գտնել ${req.originalUrl}-ը այս սերվերի վրա!`,
        404,
      ),
    );
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const renderNotFound = (contact) => {
    res.status(404).render(
      "./notFount/404",
      {
        title: "Էջը չի գտնվել (404)",
        description: "Հասցեն գոյություն չունի կամ տեղափոխվել է",
        canonical: url,
        og_image: "./images/404.jpg",
        nav_active: "404",
        page: req.path,
        contact,
      },
      (renderErr, html) => {
        if (renderErr) {
          return res.status(404).json({
            status: "fail",
            message: "Not found",
          });
        }
        res.send(html);
      },
    );
  };
  Contact.findOne()
    .then(renderNotFound)
    .catch(() => renderNotFound(null));
});

app.use(globalErrorHandler);
module.exports = app;

if (require.main === module) Server(app);