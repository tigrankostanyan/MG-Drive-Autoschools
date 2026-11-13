/**
 * Seeds a test user into the database for E2E tests.
 *
 * Safety guards:
 *   - Refuses to run unless NODE_ENV=test or E2E_SEED=1 is set.
 *   - Refuses to run unless the DB_NAME contains "test" or "e2e".
 *   - Never touches production or non-test databases.
 *
 * Credentials come from env with dummy CI-only defaults.
 */
const path = require("path");
const dotenv = require("dotenv");
const { hashPassword } = require("../src/utils/password");

// Load .env for local dev; CI sets env vars directly.
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const isTestMode = process.env.NODE_ENV === "test" || process.env.E2E_SEED === "1";

if (!isTestMode) {
  console.error(
    "🔴 seed-e2e.js: Refusing to run. Set NODE_ENV=test or E2E_SEED=1.",
  );
  process.exit(1);
}

const dbName = process.env.DB_NAME || "";
const isTestDb = /test|e2e/i.test(dbName);

if (!isTestDb) {
  console.error(
    `🔴 seed-e2e.js: Refusing to run. DB_NAME "${dbName}" does not look like a test database. Use a name containing "test" or "e2e".`,
  );
  process.exit(1);
}

async function seed() {
  const DB = require("../src/models");

  // Sync schema with alter so the test DB has all tables/columns.
  await DB.con.sync({ alter: true });

  const email = process.env.E2E_TEST_USER_EMAIL || "e2e@test.local";
  const password = process.env.E2E_TEST_USER_PASSWORD || "TestPassword123!";

  const hashedPassword = await hashPassword(password);

  const [user, created] = await DB.models.User.findOrCreate({
    where: { email },
    defaults: {
      name: "E2E Test User",
      phone: "099999999",
      password: hashedPassword,
      role: "user",
      isPaid: true,
      deleted: false,
    },
  });

  if (created) {
    console.log(`✅ Seeded E2E test user: ${email} (id=${user.id})`);
  } else {
    // Update password to ensure it matches current env
    await user.update({ password: hashedPassword });
    console.log(`✅ Updated E2E test user: ${email} (id=${user.id})`);
  }

  console.log(`🔑 Credentials: ${email} / ${password}`);
  return user;
}

seed()
  .then(() => {
    console.log("🎉 E2E seed complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("🔴 Seed failed:", err.message);
    process.exit(1);
  });
