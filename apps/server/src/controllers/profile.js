const catchAsync = require("../utils/catchAsync");
const DB = require("../models");
const { TestResult, GroupProgress, Group, Test, Question, Review } = DB.models;
exports.getProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const results = await TestResult.findAll({
    where: { userId },
    include: [
      { model: Test, as: "test", attributes: ["id", "title", "number"] },
      { model: Group, as: "group", attributes: ["id", "title", "number"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  const progressRows = await GroupProgress.findAll({
    where: { userId },
    include: [
      { model: Group, as: "group", attributes: ["id", "title", "number"] },
    ],
  });
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.status === "passed").length;
  const avgScore =
    totalTests > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / totalTests)
      : 0;
  const wrongAnswersResults = results.filter((r) => r.wrong_count > 0);
  const allGroups = await findAllGroupsWithQuestionCount();
  const questionCountByGroup = new Map(
    allGroups.map((g) => [g.id, parseInt(g.get("questionCount") || 0, 10)]),
  );
  const totalGroups = allGroups.length;
  const completedGroups = progressRows.filter((p) => {
    const ans = typeof p.answers === "object" ? p.answers : {};
    return Object.keys(ans).length > 0;
  }).length;
  const progressPercent =
    totalGroups > 0 ? Math.round((completedGroups / totalGroups) * 100) : 0;
  const completedTopics = progressRows
    .filter((p) => {
      const ans = typeof p.answers === "object" ? p.answers : {};
      return Object.keys(ans).length > 0;
    })
    .map((p) => {
      const groupId = p.group?.id;
      const answeredCount = Object.keys(
        typeof p.answers === "object" ? p.answers : {},
      ).length;
      return {
        groupId,
        title: p.group?.title || "Անհայտ խումբ",
        answeredCount,
        totalQuestions: questionCountByGroup.get(groupId) || answeredCount,
      };
    });
  const feedback = await Review.findOne({
    where: { user_id: userId },
    order: [["date", "DESC"]],
  });
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
      stats: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        avgScore,
        progressPercent,
        totalGroups,
        completedGroups,
      },
      results: results.map(formatResult),
      wrongAnswers: wrongAnswersResults.map(formatResult),
      completedTopics,
      feedback: feedback
        ? {
            id: feedback.id,
            rating: feedback.rating,
            name: feedback.name,
            type: feedback.type,
            comment: feedback.comment,
            date: feedback.date,
          }
        : null,
    },
  });
});
exports.getResults = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const results = await TestResult.findAll({
    where: { userId },
    include: [
      { model: Test, as: "test", attributes: ["id", "title", "number"] },
      { model: Group, as: "group", attributes: ["id", "title", "number"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({
    status: "success",
    data: results.map(formatResult),
  });
});
exports.getWrongAnswers = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const results = await TestResult.findAll({
    where: { userId, wrong_count: { [DB.Sequelize.Op.gt]: 0 } },
    include: [
      { model: Test, as: "test", attributes: ["id", "title", "number"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  const wrongQuestions = [];
  for (const r of results) {
    if (!r.testId) continue;
    const questions = await Question.findAll({
      where: { row_id: r.testId, table_name: "tests" },
      order: [["number", "ASC"]],
    });
    wrongQuestions.push({
      resultId: r.id,
      testId: r.testId,
      testTitle: r.test?.title,
      wrongCount: r.wrong_count,
      correctCount: r.correct_count,
      score: r.score,
      date: r.createdAt,
      questionCount: questions.length,
    });
  }
  res.status(200).json({
    status: "success",
    data: wrongQuestions,
  });
});
exports.getProgress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const progressRows = await GroupProgress.findAll({
    where: { userId },
    include: [
      { model: Group, as: "group", attributes: ["id", "title", "number"] },
    ],
  });
  const groups = await findAllGroupsWithQuestionCount();
  const progressData = groups.map((g) => {
    const prog = progressRows.find((p) => p.groupId === g.id);
    const answers =
      prog && typeof prog.answers === "object" ? prog.answers : {};
    const answeredKeys = Object.keys(answers);
    const totalQuestions = parseInt(g.get("questionCount") || 0, 10);
    return {
      groupId: g.id,
      title: g.title,
      number: g.number,
      answeredCount: answeredKeys.length,
      totalQuestions,
      hasProgress: answeredKeys.length > 0,
      updatedAt: prog?.updatedAt || null,
    };
  });
  const totalAnswered = progressData.reduce(
    (s, g) => s + (g.hasProgress ? 1 : 0),
    0,
  );
  const totalGroups = groups.length;
  const overallProgress =
    totalGroups > 0 ? Math.round((totalAnswered / totalGroups) * 100) : 0;
  res.status(200).json({
    status: "success",
    data: {
      progressPercent: overallProgress,
      completedGroups: totalAnswered,
      totalGroups,
      groups: progressData,
    },
  });
});
function findAllGroupsWithQuestionCount() {
  return Group.findAll({
    attributes: [
      "id",
      "title",
      "number",
      "sortControl",
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
  });
}
function formatResult(r) {
  return {
    id: r.id,
    testId: r.testId,
    groupId: r.groupId,
    testTitle: r.test?.title || "Անհայտ թեստ",
    groupTitle: r.group?.title || null,
    score: r.score,
    correctCount: r.correct_count,
    wrongCount: r.wrong_count,
    timeSpent: r.time_spent,
    status: r.status,
    createdAt: r.createdAt,
  };
}
