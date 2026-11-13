// Escapes LIKE wildcards (%, _) so user input cannot alter the pattern.
function escapeLike(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[%_\\]/g, "\\$&");
}
// Escape and wrap with wildcards for search
function escapeLikeSearch(str) {
  if (typeof str !== "string") return "";
  return "%" + escapeLike(str) + "%";
}
module.exports = {
  escapeLike,
  escapeLikeSearch,
};
