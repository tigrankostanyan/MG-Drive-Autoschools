const DB = require("../models");
const { Faq, FaqCategory } = DB.models;
module.exports = {
  findAll: async () => {
    const items = await Faq.findAll({ order: [["id", "DESC"]] });
    return items.map((i) => i.get({ plain: true }));
  },
  findById: async (id) => Faq.findByPk(id),
  create: async (payload) => Faq.create(payload),
  update: async (id, body) => {
    const faq = await Faq.findByPk(id);
    if (!faq) return null;
    await faq.update(body);
    return faq;
  },
  destroy: async (id) => Faq.destroy({ where: { id } }),
  findCategories: async () => {
    const rows = await FaqCategory.findAll({
      order: [["id", "ASC"]],
      attributes: ["name"],
    });
    return rows.map((r) => r.name);
  },
  replaceCategories: async (names) => {
    const t = await DB.con.transaction();
    try {
      await FaqCategory.destroy({ where: {}, transaction: t });
      if (names.length) {
        await FaqCategory.bulkCreate(
          names.map((name) => ({ name })),
          { transaction: t },
        );
      }
      await t.commit();
      return true;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  },
};
