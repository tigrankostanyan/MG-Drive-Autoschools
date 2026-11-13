const DB = require("../models");
const { Group, Question, File } = DB.models;
module.exports = {
  findAndCountAllPaged: async ({ limit, offset }) =>
    Group.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [
        ["sortControl", "ASC"],
        ["id", "ASC"],
      ],
      attributes: ["id", "title", "number", "sortControl", "text", "slug", "date"],
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["id", "question"],
          separate: true,
          order: [
            ["number", "ASC"],
            ["id", "ASC"],
          ],
          include: [
            {
              model: File,
              as: "files",
              attributes: ["id", "name", "ext", "name_used"],
              separate: true,
            },
          ],
        },
      ],
    }),
  findAllPaged: async ({ limit, offset }) =>
    Group.findAll({
      limit,
      offset,
      order: [
        ["sortControl", "ASC"],
        ["id", "ASC"],
      ],
      attributes: ["id", "title", "number", "sortControl", "text", "slug", "date"],
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["id", "question"],
          separate: true,
          order: [
            ["number", "ASC"],
            ["id", "ASC"],
          ],
          include: [
            {
              model: File,
              as: "files",
              attributes: ["id", "name", "ext", "name_used"],
              separate: true,
            },
          ],
        },
      ],
    }),
  findAllAdmin: async () =>
    Group.findAll({
      order: [
        ["sortControl", "ASC"],
        ["id", "ASC"],
        [{ model: Question, as: "questions" }, "number", "ASC"],
        [{ model: Question, as: "questions" }, "id", "ASC"],
      ],
      include: [
        {
          model: Question,
          as: "questions",
        },
      ],
    }),
  findAllMetadataAll: async () =>
    Group.findAll({
      attributes: [
        "id",
        "title",
        "number",
        "sortControl",
        "slug",
        "text",
        "createdAt",
        "updatedAt",
        [
          DB.Sequelize.literal(
            '(SELECT COUNT(*) FROM questions WHERE questions.row_id = groups.id AND questions.table_name = "groups")',
          ),
          "questionCount",
        ],
      ],
      order: [
        ["sortControl", "ASC"],
        ["id", "ASC"],
      ],
    }),
  findById: async (id) =>
    Group.findByPk(id, {
      attributes: ["id", "title", "number", "sortControl", "text", "slug", "date"],
      include: [
        {
          model: Question,
          as: "questions",
          attributes: [
            "id",
            "question",
            "options",
            "correctAnswerIndex",
            "number",
          ],
          include: [
            {
              model: File,
              as: "files",
              attributes: ["id", "name", "ext", "name_used"],
            },
          ],
        },
      ],
      order: [
        [{ model: Question, as: "questions" }, "number", "ASC"],
        [{ model: Question, as: "questions" }, "id", "ASC"],
      ],
    }),
  findMaxSortControl: async () => {
    const row = await Group.findOne({
      attributes: [
        [DB.Sequelize.fn("MAX", DB.Sequelize.col("sortControl")), "max"],
      ],
      raw: true,
    });
    return row && typeof row.max === "number" ? row.max : 0;
  },
  create: async (payload) => Group.create(payload),
  update: async (id, body) => {
    const group = await Group.findByPk(id);
    if (!group) return null;
    await group.update(body);
    return group;
  },
  findAllIds: async () =>
    Group.findAll({ attributes: ["id"] }),
  reorder: async (ids, t) => {
    for (let i = 0; i < ids.length; i++) {
      await Group.update(
        { sortControl: i + 1 },
        { where: { id: ids[i] }, transaction: t, hooks: false },
      );
    }
  },
  destroyCascade: async (id, t) => {
    const questions = await Question.findAll({
      where: {
        row_id: id,
        table_name: "groups",
      },
      transaction: t,
    });
    if (questions.length) {
      const ids = questions.map((q) => q.id);
      await File.destroy({
        where: {
          row_id: ids,
        },
        transaction: t,
      });
      await Question.destroy({
        where: {
          id: ids,
        },
        transaction: t,
      });
    }
    return Group.destroy({
      where: {
        id,
      },
      transaction: t,
    });
  },
  findQuestionsPaged: async ({ groupId, limit, offset }) => {
    return Question.findAndCountAll({
      where: {
        table_name: "groups",
        row_id: groupId,
      },
      limit,
      offset,
      order: [
        ["number", "ASC"],
        ["id", "ASC"],
      ],
      include: [
        {
          model: File,
          as: "files",
          attributes: ["id", "name", "ext", "name_used"],
        },
      ],
    });
  },
  findQuestionsByIds: async (groupId, ids) => {
    if (!ids.length) return [];
    return Question.findAll({
      where: {
        table_name: "groups",
        row_id: groupId,
        id: ids,
      },
      attributes: ["id", "correctAnswerIndex", "explanation"],
    });
  },
};
