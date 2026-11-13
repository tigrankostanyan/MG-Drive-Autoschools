const DB = require("../models");
const { AdminMenuItem } = DB.models;

module.exports = {
  findAll: async () =>
    AdminMenuItem.findAll({
      order: [["sortControl", "ASC"]],
    }),

  findMaxSortControl: async () => {
    const row = await AdminMenuItem.findOne({
      attributes: [
        [DB.Sequelize.fn("MAX", DB.Sequelize.col("sortControl")), "max"],
      ],
      raw: true,
    });
    return row && typeof row.max === "number" ? row.max : 0;
  },

  findAllIds: async () => AdminMenuItem.findAll({ attributes: ["id"] }),

  reorder: async (ids, t) => {
    for (let i = 0; i < ids.length; i++) {
      await AdminMenuItem.update(
        { sortControl: i + 1 },
        { where: { id: ids[i] }, transaction: t, hooks: false },
      );
    }
  },

  create: async (payload) => AdminMenuItem.create(payload),

  bulkCreate: async (items) => AdminMenuItem.bulkCreate(items),
};