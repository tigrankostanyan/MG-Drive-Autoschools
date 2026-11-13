const cache = require("../utils/cache");
const AppError = require("../utils/appError");
const repo = require("../repositories/faqRepository");
const CACHE_KEY = "faqs:all";
const TTL = 120;
const DEFAULT_CATEGORIES = [
  "Ընդհանուր",
  "Ուսուցում",
  "Քննություններ",
  "Վճարումներ",
  "Այլ",
];
async function getAll() {
  const cached = await cache.get(CACHE_KEY);
  if (cached) return { faqs: cached, fromCache: true };
  const items = await repo.findAll();
  await cache.set(CACHE_KEY, items, TTL);
  return { faqs: items, fromCache: false };
}
async function create(body) {
  const question =
    typeof body?.question === "string" ? body.question.trim() : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim() : "";
  if (!question) throw new AppError("Հարց դաշտը պարտադիր է", 400);
  if (!answer) throw new AppError("Պատասխանի դաշտը պարտադիր է", 400);
  const category =
    typeof body?.category === "string" && body.category.trim()
      ? body.category.trim()
      : DEFAULT_CATEGORIES[0];
  const faq = await repo.create({ question, answer, category });
  await cache.del(CACHE_KEY);
  return faq;
}
async function update(id, body) {
  const payload = {};
  if (body?.question !== undefined) {
    const question = String(body.question).trim();
    if (!question) throw new AppError("Հարց դաշտը պարտադիր է", 400);
    payload.question = question;
  }
  if (body?.answer !== undefined) {
    const answer = String(body.answer).trim();
    if (!answer) throw new AppError("Պատասխանի դաշտը պարտադիր է", 400);
    payload.answer = answer;
  }
  if (body?.category !== undefined) {
    const category = String(body.category).trim();
    if (!category) throw new AppError("Բաժինը պարտադիր է", 400);
    payload.category = category;
  }
  const faq = await repo.update(id, payload);
  if (!faq) throw new AppError("FAQ չի գտնվել", 404);
  await cache.del(CACHE_KEY);
  return faq;
}
async function remove(id) {
  const deleted = await repo.destroy(id);
  if (!deleted) throw new AppError("FAQ չի գտնվել", 404);
  await cache.del(CACHE_KEY);
  return true;
}
async function getCategories() {
  const stored = await repo.findCategories();
  const merged = [
    ...stored,
    ...DEFAULT_CATEGORIES.filter((c) => !stored.includes(c)),
  ];
  return merged;
}
async function updateCategories(names) {
  if (
    !Array.isArray(names) ||
    names.some((n) => typeof n !== "string" || !n.trim())
  ) {
    throw new AppError("Բաժինների ցուցակը սխալ է", 400);
  }
  const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  if (!unique.length) throw new AppError("Բաժինների ցուցակը դատարկ է", 400);
  await repo.replaceCategories(unique);
  await cache.del(CACHE_KEY);
  return unique;
}
module.exports = {
  getAll,
  create,
  update,
  remove,
  getCategories,
  updateCategories,
};
