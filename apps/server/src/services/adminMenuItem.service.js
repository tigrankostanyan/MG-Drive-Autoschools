const AppError = require("../utils/appError");
const dbCon = require("../utils/db");
const repo = require("../repositories/adminMenuItemRepository");
const { normalizeReorderIds } = require("../utils/reorder");
const { rollbackQuietly } = require("../utils/transaction");

async function list() {
  return repo.findAll();
}

async function reorder(ids) {
  const numericIds = await normalizeReorderIds(ids, () => repo.findAllIds(), {
    empty: "ids must be a non-empty array",
    invalid: "Invalid id in ids",
    duplicate: "ids must not contain duplicates",
    coverage: "ids must cover every existing item",
  });
  const t = await dbCon.con.transaction();
  try {
    await repo.reorder(numericIds, t);
    await t.commit();
  } catch {
    await rollbackQuietly(t);
    throw new AppError("Reorder failed", 500);
  }
}

module.exports = { list, reorder };