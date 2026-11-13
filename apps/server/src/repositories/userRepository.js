const DB = require("../models");
const { User, File } = DB.models;
const { Op } = DB.Sequelize;
module.exports = {
  findAll: async ({ where = {}, order = [] } = {}) =>
    User.findAll({ where, order, include: "files" }),
  findAndCountAll: async (options) => User.findAndCountAll(options),
  count: async (options) => User.count(options),
  findById: async (id) => User.findByPk(id, { include: "files" }),
  save: async (user) => user.save(),
  findAvatarFileForUser: async (userId) =>
    File.findOne({ where: { row_id: userId, name_used: "user_img" } }),
  destroyFileById: async (id) =>
    File.destroy({ where: { id }, individualHooks: true }),
  findAllIds: async () =>
    User.findAll({
      attributes: ["id"],
      where: { role: { [Op.notIn]: ["admin"] } },
    }),
  reorder: async (ids, t) => {
    for (let i = 0; i < ids.length; i++) {
      await User.update(
        { sortControl: i + 1 },
        { where: { id: ids[i] }, transaction: t, hooks: false },
      );
    }
  },
};
