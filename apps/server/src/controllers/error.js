// Error controller: converts thrown errors into HTTP responses
const AppError = require("../utils/appError");
const { buildSEO } = require("../services/seo");
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError("Invalid token. Please log in.", 401);
const handleJWTExpiredError = (err) =>
  new AppError("Your token has expired. Please log in again.", 401);
const handleSequelizeValidationError = (err) => {
  const errors =
    err.errors
      ?.map((e) => {
        if (e.path === "phone")
          return "Հեռախոսահամարը պետք է լինի 0xxxxxxxx կամ +374 xx xxxxxx";
        return e.message;
      })
      .join(". ") || err.message;
  return new AppError(`Validation error: ${errors}`, 400);
};
const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors?.[0]?.path || "field";
  return new AppError(
    `${field} already exists. Please use a different value.`,
    400,
  );
};
// Render the error page, falling back to plain text when the view is missing.
const renderErrorPage = (res, statusCode, view, locals, fallbackMsg) => {
  res.status(statusCode).render(view, locals, (renderErr, html) => {
    if (renderErr) {
      console.error("[error] failed to render error page:", renderErr.message);
      return res
        .status(statusCode)
        .type("text/plain")
        .send(fallbackMsg || "Something went wrong!");
    }
    res.send(html);
  });
};
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      code: err.code || "INTERNAL_ERROR",
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  else {
    return renderErrorPage(
      res,
      err.statusCode,
      "error",
      {
        ...buildSEO(req, {
          title: "Something went wrong!",
          description: "An error occurred.",
        }),
        msg: err.message,
        nav_active: "error",
      },
      err.message,
    );
  }
};
// Production: never leak error details for unknown errors
const sendErrorProd = (err, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        code: err.code || "ERROR",
        message: err.message,
      });
    }
    console.error("ERROR 💥", err);
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong!",
    });
  }
  if (err.isOperational) {
    return renderErrorPage(
      res,
      err.statusCode,
      "error",
      {
        ...buildSEO(req, {
          title: "Սխալ տեղի ունեցավ",
          description: "Խնդրում ենք փորձել կրկին ավելի ուշ։",
        }),
        msg: err.message,
        nav_active: "error",
        user: res.locals.user || null,
      },
      err.message,
    );
  }
  console.error("ERROR 💥", err);
  return renderErrorPage(
    res,
    err.statusCode,
    "error",
    {
      ...buildSEO(req, {
        title: "Սխալ տեղի ունեցավ",
        description: "Խնդրում ենք փորձել կրկին ավելի ուշ։",
      }),
      msg: "Խնդրում ենք փորձել կրկին ավելի ուշ։",
      nav_active: "error",
      user: res.locals.user || null,
    },
    "Something went wrong!",
  );
};
// Error handler middleware: normalize error and route to dev/prod handlers
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // Work on a copy so original error stays intact
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "SequelizeUniqueConstraintError")
      error = handleSequelizeUniqueConstraintError(error);
    if (error.name === "SequelizeValidationError")
      error = handleSequelizeValidationError(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};
