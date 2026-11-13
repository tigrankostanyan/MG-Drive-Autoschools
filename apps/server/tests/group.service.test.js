jest.mock("../src/repositories/groupRepository", () => ({
  findQuestionsByIds: jest.fn(),
  findQuestionsPaged: jest.fn(),
}));

const repo = require("../src/repositories/groupRepository");
const service = require("../src/services/group.service");

function fakeRow(plain) {
  return { id: plain.id, get: () => plain };
}

describe("group.service.getQuestions (student payload must not leak answers)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fullQuestion = {
    id: 11,
    number: 1,
    question: "2+2?",
    options: ["3", "4", "5"],
    image: null,
    files: [],
    correctAnswerIndex: 2,
    explanation: "Two plus two is four",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  it("strips correctAnswerIndex and explanation for students", async () => {
    repo.findQuestionsPaged.mockResolvedValue({ count: 1, rows: [fakeRow(fullQuestion)] });

    const { questions } = await service.getQuestions(1, 1, 20, true);

    expect(questions).toHaveLength(1);
    expect(questions[0]).not.toHaveProperty("correctAnswerIndex");
    expect(questions[0]).not.toHaveProperty("explanation");
    expect(questions[0]).toMatchObject({
      id: 11,
      number: 1,
      question: "2+2?",
      options: ["3", "4", "5"],
    });
  });

  it("keeps correctAnswerIndex and explanation for admins", async () => {
    repo.findQuestionsPaged.mockResolvedValue({ count: 1, rows: [fakeRow(fullQuestion)] });

    const { questions } = await service.getQuestions(1, 1, 20, false);

    expect(questions[0]).toMatchObject({
      id: 11,
      correctAnswerIndex: 2,
      explanation: "Two plus two is four",
    });
  });
});

describe("group.service.checkAnswers (student answer grading)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty results for an empty payload without hitting the repo", async () => {
    const result = await service.checkAnswers(1, {});

    expect(result).toEqual({ results: [] });
    expect(repo.findQuestionsByIds).not.toHaveBeenCalled();
  });

  it("never queries wrong/NaN answer entries against the repo", async () => {
    repo.findQuestionsByIds.mockResolvedValue([]);

    const result = await service.checkAnswers(1, { foo: "bar", 2: undefined });

    expect(repo.findQuestionsByIds).not.toHaveBeenCalled();
    expect(result).toEqual({ results: [] });
  });

  it("grades using the stored correctAnswerIndex and returns it only to the caller", async () => {
    repo.findQuestionsByIds.mockResolvedValue([
      fakeRow({ id: 10, correctAnswerIndex: 2, explanation: "Because B" }),
    ]);

    const result = await service.checkAnswers(7, { 10: 1 });

    expect(repo.findQuestionsByIds).toHaveBeenCalledWith(7, [10]);
    expect(result).toEqual({
      results: [
        { id: 10, found: true, correct: true, correctAnswerIndex: 2, explanation: "Because B" },
      ],
    });
  });

  it("marks a wrong selection as incorrect", async () => {
    repo.findQuestionsByIds.mockResolvedValue([
      fakeRow({ id: 10, correctAnswerIndex: 2, explanation: null }),
    ]);

    const result = await service.checkAnswers(7, { 10: 0 });

    expect(result.results[0]).toMatchObject({ id: 10, found: true, correct: false });
    expect(result.results[0].explanation).toBe("");
  });

  it("reports found:false for ids that do not belong to the group", async () => {
    repo.findQuestionsByIds.mockResolvedValue([fakeRow({ id: 10, correctAnswerIndex: 1 })]);

    const result = await service.checkAnswers(7, { 10: 0, 99: 0 });

    const byId = Object.fromEntries(result.results.map((r) => [r.id, r]));
    expect(byId[99]).toEqual({ id: 99, found: false });
    expect(byId[10]).toMatchObject({ found: true, correct: true });
  });

  it("passes only the requested ids to the repo", async () => {
    repo.findQuestionsByIds.mockResolvedValue([]);

    await service.checkAnswers(3, { 5: 1, 6: 0, 7: 2 });

    expect(repo.findQuestionsByIds).toHaveBeenCalledTimes(1);
    const [groupId, ids] = repo.findQuestionsByIds.mock.calls[0];
    expect(groupId).toBe(3);
    expect(ids.sort((a, b) => a - b)).toEqual([5, 6, 7]);
  });
});
