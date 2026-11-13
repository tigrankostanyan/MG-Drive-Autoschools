const AppError = require("./appError");
const dbCon = require("./db");

// A failed rollback must not replace the error that triggered it.
async function rollbackQuietly(transaction) {
  try {
    await transaction.rollback();
  } catch {
    // Deliberately ignored; the caller rethrows the original failure.
  }
}

// Runs work in a transaction, normalizing unexpected errors to a 500 AppError.
async function runInTransaction(work) {
  const transaction = await dbCon.con.transaction();
  try {
    return await work(transaction);
  } catch (error) {
    await rollbackQuietly(transaction);
    throw error instanceof AppError
      ? error
      : new AppError("Internal server error", 500);
  }
}

module.exports = { rollbackQuietly, runInTransaction };
