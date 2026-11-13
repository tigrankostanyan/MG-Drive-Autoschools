const DEFAULT_PAGE_SIZE = 20;
function clampPage(page) {
  let p = parseInt(page, 10);
  if (Number.isNaN(p) || p < 1) p = 1;
  return p;
}
// Clamp raw query limit to [1, max]
function clampPageSize(limit, max) {
  let n = parseInt(limit, 10);
  if (Number.isNaN(n) || n < 1) n = DEFAULT_PAGE_SIZE;
  if (n > max) n = max;
  return n;
}
module.exports = {
  DEFAULT_PAGE_SIZE,
  clampPage,
  clampPageSize,
};
