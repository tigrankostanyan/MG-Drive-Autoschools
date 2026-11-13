// Normalizes Armenian mobile numbers (e.g. +374 91 234567) to 9 digits.
function normalizeArmenianPhone(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return "";
  let digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("3740") && digits.length === 12) {
    digits = digits.slice(3);
  } else if (digits.startsWith("374") && digits.length === 11) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.length === 8) {
    digits = `0${digits}`;
  }
  return digits;
}
function isValidArmenianPhone(input, { allowEmpty = true } = {}) {
  const normalized = normalizeArmenianPhone(input);
  if (!normalized) {
    return allowEmpty && !String(input ?? "").replace(/[^\d]/g, "");
  }
  return /^0\d{8}$/.test(normalized);
}
module.exports = {
  normalizeArmenianPhone,
  isValidArmenianPhone,
};
