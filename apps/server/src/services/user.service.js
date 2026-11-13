const {
  USERS_ALL_KEY,
  USERS_TTL,
  MAX_ALL_USERS,
} = require("../constants/cache");
const cache = require("../utils/cache");
const AppError = require("../utils/appError");
const dbCon = require("../utils/db");
const Files = require("../controllers/File");
const { normalizeReorderIds } = require("../utils/reorder");
const { rollbackQuietly } = require("../utils/transaction");
const { throwIfUploadFailed } = require("../utils/upload");
const repo = require("../repositories/userRepository");
const { Sequelize } = require("../models");
const { filterUserBody } = require("../utils/fieldFilter");
const { escapeLike } = require("../utils/sqlEscape");
async function getAll({ excludeRoles = [] } = {}) {
  const cacheKey = USERS_ALL_KEY;
  const cached = await cache.get(cacheKey);
  if (cached) return { users: cached, fromCache: true };
  const where = excludeRoles.length
    ? { role: { [Sequelize.Op.notIn]: excludeRoles } }
    : {};
  const users = await repo.findAll({
    where,
    order: [
      ["sortControl", "ASC"],
      ["id", "ASC"],
    ],
    limit: MAX_ALL_USERS,
  });
  await cache.set(cacheKey, users, USERS_TTL);
  return { users, fromCache: false };
}
async function listPaged(
  page = 1,
  limit = 20,
  search = "",
  role = "all",
  excludeId = null,
) {
  const offset = (page - 1) * limit;
  const where = {};
  if (excludeId) {
    where.id = { [Sequelize.Op.ne]: excludeId };
  }
  if (role !== "all") {
    where.role = role;
  }
  if (search) {
    const safeSearch = escapeLike(search);
    where[Sequelize.Op.or] = [
      { name: { [Sequelize.Op.like]: `%${safeSearch}%` } },
      { email: { [Sequelize.Op.like]: `%${safeSearch}%` } },
    ];
  }
  const { count, rows } = await repo.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "email", "role", "isPaid", "createdAt"],
  });
  return { users: rows, total: count };
}
async function countByRole(role) {
  return repo.count({ where: { role } });
}
async function updateUser(id, body, files) {
  const user = await repo.findById(id);
  if (!user) throw new AppError("User not found.", 404);
  if (body.email && body.email !== user.email) {
    const existingUsers = await repo.findAll({ where: { email: body.email } });
    if (existingUsers.length > 0) {
      throw new AppError("Այս էլ․ հասցեն արդեն գրանցված է համակարգում։", 400);
    }
  }
  const safeBody = filterUserBody(body, true);
  Object.assign(user, safeBody);
  if (body.isPaid === true || body.isPaid === "true") {
    user.isPaid = true;
    user.paymentExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  } else if (body.isPaid === false || body.isPaid === "false") {
    user.isPaid = false;
    user.paymentExpiresAt = null;
  }
  await repo.save(user);
  if (files?.user_img) {
    const img = await new Files(user, files.user_img).replace("user_img");
    throwIfUploadFailed(img);
    await user.createFile(img.table);
  }
  await cache.del(USERS_ALL_KEY);
  return user;
}
async function updateMe(currentUserId, body, files) {
  const user = await repo.findById(currentUserId);
  if (!user) throw new AppError("User not found.", 404);
  if (body.email && body.email !== user.email) {
    const existingUsers = await repo.findAll({ where: { email: body.email } });
    if (existingUsers.length > 0) {
      throw new AppError("Այս էլ․ հասցեն արդեն գրանցված է համակարգում։", 400);
    }
  }
  const safeBody = filterUserBody(body, false);
  Object.assign(user, safeBody);
  await repo.save(user);
  if (files?.user_img) {
    const img = await new Files(user, files.user_img).replace("user_img");
    throwIfUploadFailed(img);
    await user.createFile(img.table);
  }
  await cache.del(USERS_ALL_KEY);
  return user;
}
async function reorder(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new AppError("userIds must be a non-empty array", 400);
  }
  const ids = userIds.map((id) => Number(id));
  if (ids.some((id) => !Number.isInteger(id) || id < 1)) {
    throw new AppError("Invalid user id in userIds", 400);
  }
  if (new Set(ids).size !== ids.length) {
    throw new AppError("userIds must not contain duplicates", 400);
  }
  const existing = await repo.findAllIds();
  const existingIds = new Set(existing.map((row) => row.id));
  if (ids.some((id) => !existingIds.has(id))) {
    throw new AppError("userIds contains unknown user id", 400);
  }

  let finalIds = ids;
  if (ids.length < existing.length) {
    const sentSet = new Set(ids);
    const remaining = existing
      .map((r) => r.id)
      .filter((id) => !sentSet.has(id));
    finalIds = [...ids, ...remaining];
  }

  const t = await dbCon.con.transaction();
  try {
    await repo.reorder(finalIds, t);
    await t.commit();
    await cache.del(USERS_ALL_KEY);
  } catch {
    await rollbackQuietly(t);
    throw new AppError("Reorder failed", 500);
  }
}
async function deleteUser(id) {
  const user = await repo.findById(id);
  if (!user) throw new AppError("User not found.", 404);
  user.deleted = true;
  await repo.save(user);
  await cache.del(USERS_ALL_KEY);
  return true;
}
async function deleteAvatar(currentUserId) {
  const user = await repo.findById(currentUserId);
  if (!user) throw new AppError("User not found.", 404);
  const file = await repo.findAvatarFileForUser(user.id);
  if (!file) throw new AppError("Avatar not found.", 404);
  await repo.destroyFileById(file.id);
  await cache.del(USERS_ALL_KEY);
  return user;
}
async function resetTests(userId) {
  const { TestResult } = require("../models").models;
  const { Op } = Sequelize;
  await TestResult.destroy({
    where: {
      userId,
      testId: { [Op.not]: null },
    },
  });
}
async function resetGroups(userId) {
  const { TestResult, GroupProgress } = require("../models").models;
  const { Op } = Sequelize;
  await Promise.all([
    TestResult.destroy({
      where: {
        userId,
        groupId: { [Op.not]: null },
      },
    }),
    GroupProgress.destroy({
      where: { userId },
    }),
  ]);
}
module.exports = {
  getAll,
  listPaged,
  countByRole,
  updateUser,
  updateMe,
  deleteUser,
  reorder,
  deleteAvatar,
  resetTests,
  resetGroups,
};
