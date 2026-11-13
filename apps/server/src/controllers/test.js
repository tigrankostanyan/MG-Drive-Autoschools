const redis = require("../utils/redisClient");
const metrics = require("../utils/metrics");
const AppError = require("../utils/appError");
const testService = require("../services/test.service");
const { randomUUID } = require("crypto");
exports.getTests = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    let limit = parseInt(req.query.limit) || 20;
    if (!Number.isFinite(limit) || limit < 1) limit = 20;
    if (limit > 50) limit = 50;
    let version = await redis.get("tests:version");
    if (!version) {
      version = 1;
      await redis.set("tests:version", version);
    }
    const cacheKey = `tests:list:v${version}:p${page}:l${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      metrics.trackCache(true);
      return res.status(200).json({
        tests: JSON.parse(cached),
      });
    }
    metrics.trackCache(false);
    const tests = await testService.listMetadata(page, limit);
    await redis.set(cacheKey, JSON.stringify(tests), {
      EX: 300, // 5 minutes, relying on version invalidation
    });
    res.status(200).json({
      tests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.submitResult = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        status: "success",
        saved: false,
        message: "User not logged in",
      });
    }
    const result = await testService.saveResult(req.user.id, req.body);
    res.status(201).json({
      status: "success",
      saved: true,
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.getTest = async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.role === "admin";
    const cacheKey = `test:${req.params.id}:v1:${isAdmin ? "admin" : "public"}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      metrics.trackCache(true);
      return res.status(200).json({
        status: "success",
        time: "0 ms",
        test: JSON.parse(cached),
      });
    }
    metrics.trackCache(false);
    const test = await testService.getById(req.params.id);
    // Answers are stripped for non-admins before caching/serving.
    const payload = isAdmin ? test : testService.stripAnswers(test);
    await redis.set(cacheKey, JSON.stringify(payload), { EX: 60 });
    res.status(200).json({
      status: "success",
      time: `${Date.now() - req.time} ms`,
      test: payload,
    });
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 404) {
      return next(err);
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.addTest = async (req, res) => {
  try {
    const test = await testService.create(req.body);
    await redis.incr("tests:version");
    res.status(201).json({
      status: "success",
      time: `${Date.now() - req.time} ms`,
      test,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode || 400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.updateTest = async (req, res, next) => {
  try {
    const test = await testService.update(req.params.id, req.body);
    await redis.incr("tests:version");
    await redis.del(`test:${req.params.id}:v1:public`);
    await redis.del(`test:${req.params.id}:v1:admin`);
    res.status(200).json({
      status: "success",
      time: `${Date.now() - req.time} ms`,
      test,
    });
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 404) {
      return next(err);
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.deleteTest = async (req, res) => {
  try {
    await testService.remove(req.params.id);
    await redis.incr("tests:version");
    res.status(204).json({ message: "Deleted successfully!" });
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 404) {
      return res.status(404).json({ message: "Test not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Test Session Streaming Endpoints
exports.createSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: "fail", error: "unauthenticated" });
    }
    const { testId } = req.body;
    if (!testId) {
      return res.status(400).json({ status: "fail", error: "testId required" });
    }
    const test = await testService.getById(testId);
    if (!test) {
      return res.status(404).json({ status: "fail", error: "Test not found" });
    }
    const sortedQuestions = (test.questions || []).sort(
      (a, b) => a.number - b.number,
    );
    const sessionId = randomUUID();
    // Store only the fields we need for the test session.
    // correctAnswerIndex is kept here for server-side verification
    // in submitSession, but is never sent to the client.
    const sessionQuestions = sortedQuestions.map((q) => ({
      id: q.id,
      number: q.number,
      question: q.question,
      options: q.options || [],
      image: q.image,
      files: q.files || [],
      correctAnswerIndex: q.correctAnswerIndex,
    }));
    const sessionData = {
      sessionId,
      userId: req.user.id,
      testId,
      questionCount: sortedQuestions.length,
      timeLimitSeconds: test.timeLimitSeconds || 1800,
      currentQuestionIndex: 0,
      answers: {},
      createdAt: Date.now(),
      questions: sessionQuestions,
    };
    const ttl = Math.ceil((sessionData.timeLimitSeconds + 300) / 60);
    await redis.set(`test-session:${sessionId}`, JSON.stringify(sessionData), { EX: ttl * 60 });
    res.status(201).json({
      status: "success",
      sessionId,
      testId,
      questionCount: sortedQuestions.length,
      timeLimitSeconds: sessionData.timeLimitSeconds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.getSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: "fail", error: "unauthenticated" });
    }
    const { sessionId } = req.params;
    const raw = await redis.get(`test-session:${sessionId}`);
    if (!raw) {
      return res.status(404).json({ status: "fail", error: "Session not found" });
    }
    const session = JSON.parse(raw);
    if (session.userId !== req.user.id) {
      return res.status(403).json({ status: "fail", error: "Forbidden" });
    }
    res.status(200).json({ status: "success", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.fetchQuestion = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: "fail", error: "unauthenticated" });
    }
    const { sessionId, questionIndex } = req.params;
    const raw = await redis.get(`test-session:${sessionId}`);
    if (!raw) {
      return res.status(404).json({ status: "fail", error: "Session not found" });
    }
    const session = JSON.parse(raw);
    if (session.userId !== req.user.id) {
      return res.status(403).json({ status: "fail", error: "Forbidden" });
    }
    const index = parseInt(questionIndex, 10);
    const questions = session.questions || [];
    if (questions.length === 0) {
      return res.status(404).json({ status: "fail", error: "Test not found" });
    }
    if (index < 0 || index >= questions.length) {
      return res.status(400).json({ status: "fail", error: "Invalid question index" });
    }
    const q = questions[index];
    const question = {
      id: q.id,
      number: q.number,
      question: q.question,
      options: q.options || [],
      image: q.image,
      files: q.files || [],
    };
    const hasNext = index < questions.length - 1;
    const nextIndex = hasNext ? index + 1 : index;
    res.status(200).json({
      status: "success",
      question,
      nextQuestionIndex: nextIndex,
      hasNext,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.submitSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: "fail", error: "unauthenticated" });
    }
    const { sessionId } = req.params;
    const raw = await redis.get(`test-session:${sessionId}`);
    if (!raw) {
      return res.status(404).json({ status: "fail", error: "Session not found" });
    }
    const session = JSON.parse(raw);
    if (session.userId !== req.user.id) {
      return res.status(403).json({ status: "fail", error: "Forbidden" });
    }
    const questions = session.questions || [];
    if (questions.length === 0) {
      return res.status(404).json({ status: "fail", error: "Test not found" });
    }
    const { answers, timeSpent } = req.body;
    let correctCount = 0;
    const userAnswers = {};
    // Build a lookup map for O(n) instead of O(n*m) with nested .find()
    const questionByNumber = new Map();
    for (const q of questions) {
      questionByNumber.set(q.number, q);
    }
    for (const [qNumStr, answerIndex] of Object.entries(answers)) {
      const qNum = parseInt(qNumStr, 10);
      const question = questionByNumber.get(qNum);
      if (!question) continue;
      userAnswers[qNum] = answerIndex;
      if (question.correctAnswerIndex === answerIndex) {
        correctCount++;
      }
    }
    const wrongCount = Object.keys(userAnswers).length - correctCount;
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = score >= 60;
    await testService.saveResult(req.user.id, {
      testId: session.testId,
      score,
      correct_count: correctCount,
      wrong_count: wrongCount,
      time_spent: timeSpent || 0,
      status: passed ? "passed" : "failed",
    });
    await redis.del(`test-session:${sessionId}`);
    res.status(200).json({
      status: "success",
      saved: true,
      score,
      correctCount,
      wrongCount,
      passed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: "fail", error: "unauthenticated" });
    }
    const { sessionId } = req.params;
    const raw = await redis.get(`test-session:${sessionId}`);
    if (!raw) {
      return res.status(404).json({ status: "fail", error: "Session not found" });
    }
    const session = JSON.parse(raw);
    if (session.userId !== req.user.id) {
      return res.status(403).json({ status: "fail", error: "Forbidden" });
    }
    await redis.del(`test-session:${sessionId}`);
    res.status(200).json({ status: "success", message: "Session cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
