const AppError = require("./appError");

// Shared ordering rule: every existing row must appear exactly once.
async function normalizeReorderIds(rawIds, findAllIds, messages) {
  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    throw new AppError(messages.empty, 400);
  }
  const ids = rawIds.map((id) => Number(id));
  if (ids.some((id) => !Number.isInteger(id) || id < 1)) {
    throw new AppError(messages.invalid, 400);
  }
  if (new Set(ids).size !== ids.length) {
    throw new AppError(messages.duplicate, 400);
  }
  const existing = await findAllIds();
  const existingIds = new Set(existing.map((row) => row.id));
  if (
    ids.length !== existingIds.size ||
    ids.some((id) => !existingIds.has(id))
  ) {
    throw new AppError(messages.coverage, 400);
  }
  return ids;
}

module.exports = { normalizeReorderIds };
