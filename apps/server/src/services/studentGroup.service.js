const AppError = require("../utils/appError");
const dbCon = require("../utils/db");
const repo = require("../repositories/studentGroupRepository");
const { normalizeReorderIds } = require("../utils/reorder");
const {
  rollbackQuietly,
  runInTransaction,
} = require("../utils/transaction");
async function listPaged(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [total, rows] = await Promise.all([
    repo.countAll(),
    repo.findAllPaged({ limit, offset }),
  ]);
  const groups = rows.map((r) => {
    const plain = r.get({ plain: true });
    plain.studentCount = Number(plain.studentCount || 0);
    return plain;
  });
  return { groups, total };
}
async function listAll() {
  const rows = await repo.findAll();
  return rows.map((r) => {
    const plain = r.get({ plain: true });
    plain.studentCount = Number(plain.studentCount || 0);
    return plain;
  });
}
async function getById(id) {
  const group = await repo.findById(id);
  if (!group) throw new AppError("Student group not found", 404);
  return group;
}
async function create(body) {
  const title = String(body.title || "").trim();
  if (!title) throw new AppError("Խմբի անունը պարտադիր է", 400);
  const existing = await repo.findByTitle(title);
  if (existing)
    throw new AppError("Այս անունով խումբ արդեն գոյություն ունի", 409);
  const maxSort = await repo.findMaxSortControl();
  return repo.create({ title, sortControl: maxSort + 1 });
}
async function update(id, body) {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError("Student group not found", 404);
  const title =
    body.title === undefined ? undefined : String(body.title).trim();
  if (title !== undefined && !title)
    throw new AppError("Խմբի անունը պարտադիր է", 400);
  const payload = {};
  if (title !== undefined) {
    const existing = await repo.findByTitle(title, id);
    if (existing)
      throw new AppError("Այս անունով խումբ արդեն գոյություն ունի", 409);
    payload.title = title;
  }
  if (body.grantStudentAccess !== undefined) {
    if (typeof body.grantStudentAccess !== "boolean") {
      throw new AppError("grantStudentAccess-ը պետք է լինի boolean", 400);
    }
    payload.grantStudentAccess = body.grantStudentAccess;
  }
  if (body.activeFrom !== undefined) {
    if (body.activeFrom === null) {
      payload.activeFrom = null;
    } else {
      const d = new Date(body.activeFrom);
      if (isNaN(d.getTime()))
        throw new AppError("Ակտիվացման ամսաթիվը ճիշտ չէ", 400);
      payload.activeFrom = d;
    }
  }
  if (body.activeUntil !== undefined) {
    if (body.activeUntil === null) {
      payload.activeUntil = null;
    } else {
      const d = new Date(body.activeUntil);
      if (isNaN(d.getTime()))
        throw new AppError("Անջատման ամսաթիվը ճիշտ չէ", 400);
      payload.activeUntil = d;
    }
  }
  // Check effective values, or a one-ended update could invert the window.
  const effectiveFrom =
    payload.activeFrom !== undefined ? payload.activeFrom : existing.activeFrom;
  const effectiveUntil =
    payload.activeUntil !== undefined
      ? payload.activeUntil
      : existing.activeUntil;
  if (
    effectiveFrom &&
    effectiveUntil &&
    new Date(effectiveUntil) <= new Date(effectiveFrom)
  ) {
    throw new AppError(
      "Անջատման ժամը պետք է ուշ լինի ակտիվացման ժամից",
      400,
    );
  }
  const group = await repo.update(id, payload);
  if (!group) throw new AppError("Student group not found", 404);
  return group;
}
async function remove(id) {
  return runInTransaction(async (t) => {
    const { User } = require("../models").models;
    await User.update(
      { groupId: null },
      { where: { groupId: id }, transaction: t },
    );
    const deleted = await repo.remove(id);
    if (!deleted) throw new AppError("Student group not found", 404);
    await t.commit();
    return true;
  });
}
async function getStudents(id) {
  await getById(id);
  const [students, allStudents] = await Promise.all([
    repo.findStudents(id),
    repo.findAllStudents(),
  ]);
  return { students, allStudents };
}
async function setStudents(id, studentIds) {
  await getById(id);
  if (
    !Array.isArray(studentIds) ||
    studentIds.some((n) => !Number.isInteger(n) || n < 1)
  ) {
    throw new AppError("Ուսանողների ցուցակը սխալ է", 400);
  }
  await repo.replaceStudents(id, studentIds);
  return true;
}
async function reorder(groupIds) {
  const ids = await normalizeReorderIds(groupIds, () => repo.findAllIds(), {
    empty: "groupIds must be a non-empty array",
    invalid: "Invalid group id in groupIds",
    duplicate: "groupIds must not contain duplicates",
    coverage: "groupIds must cover every existing group",
  });
  const t = await dbCon.con.transaction();
  try {
    await repo.reorder(ids, t);
    await t.commit();
  } catch {
    await rollbackQuietly(t);
    throw new AppError("Reorder failed", 500);
  }
}
module.exports = {
  listPaged,
  listAll,
  getById,
  create,
  update,
  reorder,
  remove,
  getStudents,
  setStudents,
};
