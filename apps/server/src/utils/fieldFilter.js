// Fields regular users cannot modify.
const PROTECTED_FIELDS = [
  "id", // Cannot change primary key
  "password", // Must use bcrypt via model hooks
  "role", // Only admin can change
  "login_token", // Internal session management
  "passwordResetToken",
  "passwordResetExpires",
  "passwordChangedAt",
  "deleted", // Soft delete flag
  "date", // Creation timestamp
  "isPaid", // Payment status (admin only)
  "paymentExpiresAt", // Payment expiry (admin only)
  "include_in_analytics", // Analytics flag (admin only)
];
const USER_ALLOWED_FIELDS = [
  "name",
  "phone",
  "email",
  "address",
  "age",
  "experience",
  "biography",
  "specialization",
  "certificates",
  "education",
];
const ADMIN_ALLOWED_FIELDS = [
  ...USER_ALLOWED_FIELDS,
  "role",
  "isPaid",
  "paymentExpiresAt",
  "include_in_analytics",
];
function filterFields(body, allowedFields) {
  const filtered = {};
  if (!body || typeof body !== "object") return filtered;
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      filtered[field] = body[field];
    }
  });
  return filtered;
}
function filterUserBody(body, isAdmin = false) {
  if (isAdmin) {
    return filterFields(body, ADMIN_ALLOWED_FIELDS);
  }
  return filterFields(body, USER_ALLOWED_FIELDS);
}
function getProtectedFields(body) {
  if (!body || typeof body !== "object") return [];
  return Object.keys(body).filter((key) => PROTECTED_FIELDS.includes(key));
}
module.exports = {
  filterUserBody,
  filterFields,
  getProtectedFields,
  USER_ALLOWED_FIELDS,
  ADMIN_ALLOWED_FIELDS,
  PROTECTED_FIELDS,
};
