const DB = require("../models");
const { Op } = DB.Sequelize;
const catchAsync = require("../utils/catchAsync");

exports.getDashboardAnalytics = catchAsync(async (req, res, next) => {
  const { TestResult, Question } = DB.models;

  const now = new Date();
  const activityData = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);

    const testsCount = await TestResult.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      }
    });

    const passesCount = await TestResult.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: "passed"
      }
    });

    const day = startOfDay.getDate().toString().padStart(2, '0');
    const month = (startOfDay.getMonth() + 1).toString().padStart(2, '0');

    activityData.push({
      date: `${day}.${month}`,
      tests: testsCount,
      passes: passesCount,
    });
  }

  const groupQuestionsCount = await Question.count({
    where: { table_name: "groups" }
  });

  const testQuestionsCount = await Question.count({
    where: { table_name: "tests" }
  });
  
  const hardQuestionsCount = await Question.count({
    where: { question: { [Op.like]: '%խաչմերուկ%' } }
  });

  const signsQuestionsCount = await Question.count({
    where: { 
      question: { 
        [Op.or]: [
          { [Op.like]: '%նշան%' },
          { [Op.like]: '%գծանշում%' }
        ]
      } 
    }
  });

  const categoryData = [
    {
      name: "Տեսական Խմբեր",
      value: groupQuestionsCount,
      color: "#6366F1",
    },
    {
      name: "Թեստեր",
      value: testQuestionsCount,
      color: "#10B981",
    },
    { name: "Բարդ Հարցեր", value: hardQuestionsCount, color: "#F59E0B" },
    { name: "Նշաններ & Գծանշում", value: signsQuestionsCount, color: "#EC4899" },
  ];

  res.status(200).json({
    status: "success",
    data: {
      activityData,
      categoryData,
    },
  });
});

exports.getStudentAnalytics = catchAsync(async (req, res, next) => {
  const { User, TestResult, StudentGroup, Test, Group, File } = DB.models;
  const { groupId, search, status } = req.query;

  const userWhere = {
    role: "student",
  };

  if (groupId && groupId !== "all") {
    userWhere.groupId = parseInt(groupId, 10);
  }

  const students = await User.findAll({
    where: userWhere,
    attributes: ["id", "name", "email", "phone", "groupId", "include_in_analytics", "createdAt"],
    include: [
      {
        model: StudentGroup,
        as: "studentGroup",
        attributes: ["id", "title"],
      },
      {
        model: File,
        as: "files",
        required: false,
        where: { name_used: "user_img" },
        attributes: ["name", "ext", "name_used"],
      },
    ],
    order: [["sortControl", "ASC"], ["createdAt", "DESC"]],
  });

  const studentIds = students.map((s) => s.id);

  let results = [];
  if (studentIds.length > 0) {
    results = await TestResult.findAll({
      where: {
        userId: { [Op.in]: studentIds },
      },
      include: [
        { model: Test, as: "test", attributes: ["id", "title", "number"] },
        { model: Group, as: "group", attributes: ["id", "title", "number"] },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  const studentMap = {};
  students.forEach((s) => {
    const file = s.files && s.files.length > 0 ? s.files[0] : null;
    const cleanExt = file?.ext ? (file.ext.startsWith(".") ? file.ext.slice(1) : file.ext) : "";
    const avatar = file ? `/images/users/large/${file.name}.${cleanExt}` : null;
    studentMap[s.id] = {
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      avatar,
      groupId: s.groupId,
      groupTitle: s.studentGroup ? s.studentGroup.title : null,
      include_in_analytics: s.include_in_analytics !== false,
      attempts: 0,
      scores: [],
      testScores: [],
      groupScores: [],
      latestScore: 0,
      avgScore: 0,
      growth: 0,
      testGrowth: 0,
      groupGrowth: 0,
      status: "stagnant",
      totalCorrect: 0,
      totalWrong: 0,
      testAttempts: 0,
      groupAttempts: 0,
      recentResults: [],
    };
  });

  results.forEach((r) => {
    const s = studentMap[r.userId];
    if (!s) return;

    s.attempts++;
    s.scores.push(r.score);
    s.totalCorrect += (r.correct_count || 0);
    s.totalWrong += (r.wrong_count || 0);

    if (r.testId) {
      s.testScores.push(r.score);
      s.testAttempts++;
    }
    if (r.groupId) {
      s.groupScores.push(r.score);
      s.groupAttempts++;
    }

    s.latestScore = r.score;

    s.recentResults.unshift({
      id: r.id,
      testId: r.testId,
      groupId: r.groupId,
      title: r.test ? (r.test.title || `Թեստ ${r.test.number}`) : (r.group ? (r.group.title || `Խումբ ${r.group.number}`) : "Թեստ"),
      type: r.testId ? "test" : "group",
      score: r.score,
      correct_count: r.correct_count,
      wrong_count: r.wrong_count,
      time_spent: r.time_spent,
      status: r.status,
      date: r.createdAt,
    });
  });

  Object.values(studentMap).forEach((s) => {
    if (s.scores.length > 0) {
      const sum = s.scores.reduce((a, b) => a + b, 0);
      s.avgScore = Math.round(sum / s.scores.length);
    }

    if (s.attempts > 1) {
      const prev = s.scores.slice(0, -1);
      const avgPrev = prev.reduce((a, b) => a + b, 0) / prev.length;
      s.growth = Number((s.latestScore - avgPrev).toFixed(1));
    } else {
      s.growth = 0;
    }

    if (s.testScores.length > 1) {
      const latest = s.testScores[s.testScores.length - 1];
      const prev = s.testScores.slice(0, -1);
      const avgPrev = prev.reduce((a, b) => a + b, 0) / prev.length;
      s.testGrowth = Number((latest - avgPrev).toFixed(1));
    } else {
      s.testGrowth = 0;
    }

    if (s.groupScores.length > 1) {
      const latest = s.groupScores[s.groupScores.length - 1];
      const prev = s.groupScores.slice(0, -1);
      const avgPrev = prev.reduce((a, b) => a + b, 0) / prev.length;
      s.groupGrowth = Number((latest - avgPrev).toFixed(1));
    } else {
      s.groupGrowth = 0;
    }

    if (s.latestScore < 50 || (s.attempts > 2 && s.growth < -5)) {
      s.status = "risk";
    } else if (s.growth > 3 || (s.latestScore >= 80 && s.growth >= 0)) {
      s.status = "improving";
    } else {
      s.status = "stagnant";
    }
  });

  let studentList = Object.values(studentMap);

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    studentList = studentList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)),
    );
  }

  if (status && status !== "all") {
    studentList = studentList.filter((s) => s.status === status);
  }

  const activeStudents = studentList.filter((s) => s.include_in_analytics);

  let totalAttempts = 0;
  let totalScoreSum = 0;
  let totalMistakes = 0;
  let totalPasses = 0;
  let testAttempts = 0;
  let testGrowthSum = 0;
  let testGrowthCount = 0;
  let testMistakes = 0;
  let groupAttempts = 0;
  let groupGrowthSum = 0;
  let groupGrowthCount = 0;
  let groupMistakes = 0;

  activeStudents.forEach((s) => {
    totalAttempts += s.attempts;
    totalMistakes += s.totalWrong;
    testAttempts += s.testAttempts;
    groupAttempts += s.groupAttempts;

    if (s.testAttempts > 1) {
      testGrowthSum += s.testGrowth;
      testGrowthCount++;
    }
    if (s.groupAttempts > 1) {
      groupGrowthSum += s.groupGrowth;
      groupGrowthCount++;
    }

    s.recentResults.forEach((r) => {
      totalScoreSum += r.score;
      if (r.status === "passed") totalPasses++;
      if (r.type === "test") testMistakes += (r.wrong_count || 0);
      if (r.type === "group") groupMistakes += (r.wrong_count || 0);
    });
  });

  const summary = {
    tests: {
      count: testAttempts,
      avgGrowth: testGrowthCount > 0 ? Number((testGrowthSum / testGrowthCount).toFixed(1)) : 0,
      mistakes: testMistakes,
    },
    groups: {
      count: groupAttempts,
      avgGrowth: groupGrowthCount > 0 ? Number((groupGrowthSum / groupGrowthCount).toFixed(1)) : 0,
      mistakes: groupMistakes,
    },
    overall: {
      attempts: totalAttempts,
      avgScore: totalAttempts > 0 ? Math.round(totalScoreSum / totalAttempts) : 0,
      mistakes: totalMistakes,
      passRate: totalAttempts > 0 ? Math.round((totalPasses / totalAttempts) * 100) : 0,
    },
    counts: {
      total: studentList.length,
      active: activeStudents.length,
      improving: activeStudents.filter((s) => s.status === "improving").length,
      risk: activeStudents.filter((s) => s.status === "risk").length,
      stagnant: activeStudents.filter((s) => s.status === "stagnant").length,
    },
  };

  res.status(200).json({
    status: "success",
    data: {
      students: studentList,
      summary,
    },
  });
});

exports.toggleStudentAnalytics = catchAsync(async (req, res, next) => {
  const { User } = DB.models;
  const { id } = req.params;
  const { include } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ status: "fail", message: "Ուսանողը չի գտնվել" });
  }

  const newValue = typeof include === "boolean" ? include : !user.include_in_analytics;
  user.include_in_analytics = newValue;
  await user.save();

  try {
    const cache = require("../utils/cache");
    const { USERS_ALL_KEY } = require("../constants/cache");
    await cache.del(USERS_ALL_KEY);
  } catch (e) {
    // ignore cache failure
  }

  res.status(200).json({
    status: "success",
    data: {
      id: user.id,
      include_in_analytics: user.include_in_analytics,
    },
  });
});

exports.bulkToggleStudentAnalytics = catchAsync(async (req, res, next) => {
  const { User } = DB.models;
  const { include, groupId, userIds } = req.body;

  const where = { role: "student" };
  if (groupId && groupId !== "all") {
    where.groupId = parseInt(groupId, 10);
  }
  if (Array.isArray(userIds) && userIds.length > 0) {
    where.id = { [Op.in]: userIds };
  }

  const targetValue = typeof include === "boolean" ? include : false;

  await User.update(
    { include_in_analytics: targetValue },
    { where },
  );

  try {
    const cache = require("../utils/cache");
    const { USERS_ALL_KEY } = require("../constants/cache");
    await cache.del(USERS_ALL_KEY);
  } catch (e) {
    // ignore cache failure
  }

  res.status(200).json({
    status: "success",
    message: "Կարգավիճակները թարմացվեցին",
    include: targetValue,
  });
});
