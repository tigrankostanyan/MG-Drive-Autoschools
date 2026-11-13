const { GALLERY_ALL_KEY, GALLERY_TTL } = require("../constants/cache");
const cache = require("../utils/cache");
const AppError = require("../utils/appError");
const Files = require("../controllers/File");
const repo = require("../repositories/galleryRepository");
const { runInTransaction } = require("../utils/transaction");
const { throwIfUploadFailed } = require("../utils/upload");
async function getAll() {
  const cached = await cache.get(GALLERY_ALL_KEY);
  if (cached) return { items: cached, fromCache: true };
  const items = await repo.findAll();
  await cache.set(GALLERY_ALL_KEY, items, GALLERY_TTL);
  return { items, fromCache: false };
}
async function create(body, files) {
  return runInTransaction(async (t) => {
    const title = body?.title;
    const text = body?.text;
    if (!title || !title.trim())
      throw new AppError("Վերնագիր դաշտը պարտադիր է", 403);
    const payload = { title: title.trim(), text };
    const gallery = await repo.create(payload, t);
    if (files?.gallery_img) {
      if (!gallery.files)
        await gallery.reload({
          include: [{ association: "files" }],
          transaction: t,
        });
      const image = await new Files(gallery, files.gallery_img).replace(
        "gallery_img",
      );
      throwIfUploadFailed(image, "Նկար վերբեռնելու սխալ");
      await gallery.createFile(
        { ...image.table, row_id: gallery.id },
        { transaction: t },
      );
    }
    await t.commit();
    const fullItem = await repo.findById(gallery.id);
    await cache.del(GALLERY_ALL_KEY);
    return fullItem;
  });
}
async function update(id, body, files) {
  return runInTransaction(async (t) => {
    const item = await repo.findById(id, t);
    if (!item) throw new AppError("Գալերիայի նյութը չի գտնվել", 404);
    if (body.title !== undefined) item.title = body.title.trim();
    if (body.text !== undefined) item.text = body.text;
    await repo.save(item, t);
    if (files?.gallery_img) {
      const image = await new Files(item, files.gallery_img).replace(
        "gallery_img",
      );
      throwIfUploadFailed(image, "Նկար վերբեռնելու սխալ");
      await item.createFile(
        { ...image.table, row_id: item.id },
        { transaction: t },
      );
    }
    await t.commit();
    const fullItem = await repo.findById(item.id);
    await cache.del(GALLERY_ALL_KEY);
    return fullItem;
  });
}
async function deleteItem(id) {
  return runInTransaction(async (t) => {
    const item = await repo.findById(id, t);
    if (!item) throw new AppError("Գալերիայի նյութը չի գտնվել", 404);
    const files = await repo.findFilesForRow(id, t);
    if (files.length)
      await repo.destroyFilesByIds(
        files.map((f) => f.id),
        t,
      );
    await repo.destroyById(id, t);
    await t.commit();
    await cache.del(GALLERY_ALL_KEY);
    return true;
  });
}
module.exports = { getAll, create, update, delete: deleteItem };
