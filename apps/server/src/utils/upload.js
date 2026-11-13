const AppError = require("./appError");

// Upload results may carry a per-field message object; flatten to one string.
function uploadErrorMessage(result) {
  if (!result || result.status === "success") return null;
  const { message } = result;
  if (message && typeof message === "object") {
    return Object.values(message).join(" ");
  }
  return message;
}

// Throws a 400 AppError when the File helper reports a failed upload.
function throwIfUploadFailed(result, fallback) {
  const message = uploadErrorMessage(result);
  if (message === null) return;
  throw new AppError(message || fallback, 400);
}

module.exports = { uploadErrorMessage, throwIfUploadFailed };
