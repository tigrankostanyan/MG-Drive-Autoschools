const errorHandler = require("../src/controllers/error");

const originalEnv = process.env.NODE_ENV;

function runHandler(err) {
  return new Promise((resolve) => {
    const req = { originalUrl: "/api/v1/users" };
    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        resolve(this);
        return this;
      },
    };
    errorHandler(err, req, res, () => {});
  });
}

describe("error handler (production)", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("maps SequelizeUniqueConstraintError to a 400 with the offending field", async () => {
    const err = new Error("Validation error");
    err.name = "SequelizeUniqueConstraintError";
    err.errors = [{ path: "email", message: "email must be unique" }];

    const res = await runHandler(err);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("fail");
    expect(res.body.message).toContain("email");
    expect(res.body.message).toContain("already exists");
    expect(JSON.stringify(res.body)).not.toContain("Validation error");
  });

  it("maps SequelizeValidationError to a 400 with joined messages", async () => {
    const err = new Error("Validation error");
    err.name = "SequelizeValidationError";
    err.errors = [
      { path: "fullName", message: "fullName cannot be null" },
      { path: "email", message: "email must be valid" },
    ];

    const res = await runHandler(err);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("fullName cannot be null");
    expect(res.body.message).toContain("email must be valid");
  });

  it("maps SequelizeForeignKeyConstraintError to a 400", async () => {
    const err = new Error("Cannot add or update a child row");
    err.name = "SequelizeForeignKeyConstraintError";

    const res = await runHandler(err);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Related record");
  });

  it("does not crash on a Mongo-style duplicate key error (no errmsg)", async () => {
    const err = new Error("E11000 duplicate key error");
    err.code = 11000;

    const res = await runHandler(err);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Something went wrong!");
  });

  it("hides internal details for unknown errors", async () => {
    const err = new Error("secret internal detail");

    const res = await runHandler(err);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Something went wrong!");
    expect(JSON.stringify(res.body)).not.toContain("secret internal detail");
  });
});
