const DB = require("../models");
const { StudentGroup, User } = DB.models;
const countLiteral = DB.Sequelize.literal(
  "(SELECT COUNT(*) FROM users WHERE users.groupId = student_groups.id AND users.deleted = 0)",
);
module.exports = {
  countAll: async () => StudentGroup.count(),
  findAllPaged: async ({ limit, offset }) =>
    StudentGroup.findAll({
      limit,
      offset,
      order: [
        ["sortControl", "ASC"],
        ["id", "ASC"],
      ],
      attributes: {
        include: [[countLiteral, "studentCount"]],
      },
    }),
  findAll: async () =>
    StudentGroup.findAll({
      order: [
        ["sortControl", "ASC"],
        ["id", "ASC"],
      ],
      attributes: {
        include: [[countLiteral, "studentCount"]],
      },
    }),
  findMaxSortControl: async () => {
    const row = await StudentGroup.findOne({
      attributes: [
        [DB.Sequelize.fn("MAX", DB.Sequelize.col("sortControl")), "max"],
      ],
      raw: true,
    });
    return row && typeof row.max === "number" ? row.max : 0;
  },
  findAllIds: async () => StudentGroup.findAll({ attributes: ["id"] }),
  reorder: async (ids, t) => {
    for (let i = 0; i < ids.length; i++) {
      await StudentGroup.update(
        { sortControl: i + 1 },
        { where: { id: ids[i] }, transaction: t, hooks: false },
      );
    }
  },
  findById: async (id) =>
    StudentGroup.findByPk(id, {
      attributes: [
        "id",
        "title",
        "grantStudentAccess",
        "activeFrom",
        "activeUntil",
        "date",
      ],
    }),
  create: async (payload) => StudentGroup.create(payload),
  findByTitle: async (title, excludeId) => {
    const where = {
      [DB.Sequelize.Op.and]: [
        DB.Sequelize.where(
          DB.Sequelize.fn("LOWER", DB.Sequelize.col("title")),
          title.trim().toLowerCase(),
        ),
      ],
    };
    if (excludeId) where[DB.Sequelize.Op.and].push({ id: { [DB.Sequelize.Op.ne]: excludeId } });
    return StudentGroup.findOne({ where });
  },
  update: async (id, body) => {
    const group = await StudentGroup.findByPk(id);
    if (!group) return null;
    await group.update(body);
    return group;
  },
  remove: async (id) => StudentGroup.destroy({ where: { id } }),
  findStudents: async (groupId) =>
    User.findAll({
      where: { role: "student", groupId, deleted: false },
      attributes: ["id", "name", "email", "phone"],
    }),
  findAllStudents: async () =>
    User.findAll({
      where: { role: "student", deleted: false },
      attributes: ["id", "name", "email", "phone", "groupId"],
      order: [["name", "ASC"]],
    }),
  replaceStudents: async (groupId, studentIds) => {
    const t = await DB.con.transaction();
    try {
      await User.update(
        { groupId: null },
        { where: { groupId, deleted: false }, transaction: t },
      );
      if (studentIds.length) {
        await User.update(
          { groupId },
          {
            where: { id: studentIds, role: "student", deleted: false },
            transaction: t,
          },
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
