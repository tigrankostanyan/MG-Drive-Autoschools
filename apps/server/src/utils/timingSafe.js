// Timing-safe compare; Argon2id for new hashes, bcrypt for legacy ones.
const { verifyPassword } = require("./password");
// Dummy bcrypt hash for timing-safe comparison when user not found
const DUMMY_HASH =
  "$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012";
async function safePasswordCompare(candidatePassword, userPassword) {
  const hashToCompare = userPassword || DUMMY_HASH;
  return await verifyPassword(candidatePassword, hashToCompare);
}
async function safeAuthenticate(candidatePassword, userPassword, userExists) {
  const isValid = await safePasswordCompare(candidatePassword, userPassword);
  return {
    valid: isValid && userExists,
    userExists: userExists,
  };
}
module.exports = {
  safePasswordCompare,
  safeAuthenticate,
  DUMMY_HASH,
};
