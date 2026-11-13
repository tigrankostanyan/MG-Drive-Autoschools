const cache = require("../utils/cache");
const AppError = require("../utils/appError");
const dbCon = require("../utils/db");
const repo = require("../repositories/groupRepository");
const { normalizeReorderIds } = require("../utils/reorder");
const {
  rollbackQuietly,
  runInTransaction,
} = require("../utils/transaction");
const {
  GROUPS_PAGE_PREFIX,
  GROUPS_ALL_METADATA_KEY,
} = require("../constants/cache");

const STUDENT_QUESTION_FIELDS = [
  "id",
  "number",
  "question",
  "options",
  "image",
  "files",
];

function pickFields(data, fields) {
  const picked = {};
  for (const field of fields) {
    if (data[field] !== undefined) picked[field] = data[field];
  }
  return picked;
}

function stripQuestionFields(question, isStudent) {
  const data = question.get({ plain: true });
  if (!isStudent) return data;
  return pickFields(data, STUDENT_QUESTION_FIELDS);
}
async function listPaged(page = 1, limit = 20) {
  const key = `${GROUPS_PAGE_PREFIX}:page=${page}:limit=${limit}`;
  const cached = await cache.get(key);
  if (cached && cached.groups && typeof cached.total === "number") {
    return { ...cached, fromCache: true };
  }
  const offset = (page - 1) * limit;
  const { count, rows } = await repo.findAndCountAllPaged({ limit, offset });
  const groups = rows.map((r) => r.get({ plain: true }));
  const result = { groups, total: count };
  await cache.set(key, result, 20); // Short TTL for freshness
  return { ...result, fromCache: false };
}
async function listAdmin() {
  return repo.findAllAdmin();
}
async function listAllMetadata() {
  const key = GROUPS_ALL_METADATA_KEY;
  const cached = await cache.get(key);
  if (cached) return cached;
  const rows = await repo.findAllMetadataAll();
  const groups = rows.map((r) => {
    const plain = r.get({ plain: true });
    return {
      id: plain.id,
      title: plain.title,
      number: plain.number,
      sortControl: plain.sortControl,
      slug: plain.slug,
      text: plain.text,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      questionCount: parseInt(plain.questionCount || 0, 10),
    };
  });
  await cache.set(key, groups, 3600);
  return groups;
}
async function getById(id) {
  const group = await repo.findById(id);
  if (!group) throw new AppError("Group not found", 404);
  return group;
}
// Public-facing view: answers must never leave the server for non-admins.
function stripAnswers(group) {
  if (!group || !Array.isArray(group.questions)) return group;
  const base = typeof group.get === "function" ? group.get({ plain: true }) : group;
  return {
    ...base,
    questions: group.questions.map((q) => {
      const data = typeof q.get === "function" ? q.get({ plain: true }) : q;
      return pickFields(data, STUDENT_QUESTION_FIELDS);
    }),
  };
}
async function getQuestions(groupId, page = 1, limit = 20, isStudent = true) {
  const offset = (page - 1) * limit;
  const { count, rows } = await repo.findQuestionsPaged({
    groupId,
    limit,
    offset,
  });
  return {
    total: count,
    questions: rows.map((q) => stripQuestionFields(q, isStudent)),
  };
}
async function checkAnswers(groupId, answers) {
  const entries = Object.entries(answers || {})
    .map(([id, selected]) => ({ id: Number(id), selected: Number(selected) }))
    .filter((e) => Number.isFinite(e.id) && Number.isFinite(e.selected));
  if (!entries.length) return { results: [] };
  const ids = entries.map((e) => e.id);
  const rows = await repo.findQuestionsByIds(groupId, ids);
  const byId = new Map(rows.map((r) => [r.id, r.get({ plain: true })]));
  const results = entries.map(({ id, selected }) => {
    const question = byId.get(id);
    if (!question) return { id, found: false };
    return {
      id,
      found: true,
      correct: selected === question.correctAnswerIndex - 1,
      correctAnswerIndex: question.correctAnswerIndex,
      explanation: question.explanation || "",
    };
  });
  return { results };
}
async function create(body) {
  const maxSort = await repo.findMaxSortControl();
  const group = await repo.create({ ...body, sortControl: maxSort + 1 });
  await cache.del(GROUPS_ALL_METADATA_KEY);
  return group;
}
async function update(id, body) {
  const group = await repo.update(id, body);
  if (!group) throw new AppError("Group not found", 404);
  await cache.del(GROUPS_ALL_METADATA_KEY);
  return group;
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
    await cache.del(GROUPS_ALL_METADATA_KEY);
  } catch {
    await rollbackQuietly(t);
    throw new AppError("Reorder failed", 500);
  }
}
async function remove(id) {
  return runInTransaction(async (t) => {
    const deleted = await repo.destroyCascade(id, t);
    if (!deleted) throw new AppError("Group not found", 404);
    await t.commit();
    await cache.del(GROUPS_ALL_METADATA_KEY);
    return true;
  });
}
module.exports = {
  listPaged,
  listAdmin,
  listAllMetadata,
  getById,
  stripAnswers,
  create,
  update,
  reorder,
  remove,
  getQuestions,
  checkAnswers,
};
