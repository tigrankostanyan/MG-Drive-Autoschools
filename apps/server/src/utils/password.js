const bcrypt = require("bcryptjs");
const { hash: argon2Hash, verify: argon2Verify } = require("@node-rs/argon2");

const ARGON2_PARAMS = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

const MIN_PASSWORD_LENGTH = 8;

const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "123456", "1234567", "12345678",
  "123456789", "1234567890", "12345678910", "qwerty", "qwerty123", "abc123",
  "abc123456", "iloveyou", "admin", "admin123", "admin1234", "welcome",
  "welcome1", "monkey", "dragon", "letmein", "sunshine", "princess",
  "football", "baseball", "superman", "batman", "trustno1", "111111",
  "000000", "master", "shadow", "michael", "jennifer", "11111111", "123123",
  "654321", "hello123", "freedom", "whatever", "qazwsx", "123qwe", "1q2w3e",
]);

function isBcryptHash(hash) {
  return typeof hash === "string" && /^\$2[aby]\$/.test(hash);
}

function isArgon2idHash(hash) {
  return typeof hash === "string" && hash.startsWith("$argon2id$");
}

async function hashPassword(plain) {
  return argon2Hash(String(plain), {
    memoryCost: ARGON2_PARAMS.memoryCost,
    timeCost: ARGON2_PARAMS.timeCost,
    parallelism: ARGON2_PARAMS.parallelism,
  });
}

// Dual-verify
async function verifyPassword(plain, hash) {
  if (!hash) return false;
  if (isArgon2idHash(hash)) {
    try {
      return await argon2Verify(hash, String(plain));
    } catch {
      return false;
    }
  }
  if (isBcryptHash(hash)) {
    try {
      return await bcrypt.compare(String(plain), hash);
    } catch {
      return false;
    }
  }
  return false;
}

// True when the stored hash is legacy bcrypt.
function needsRehash(hash) {
  if (isBcryptHash(hash)) return true;
  if (!isArgon2idHash(hash)) return false;
  // PHC params segment looks like "m=19456,t=2,p=1".
  const params = hash.split("$").find((segment) => segment.startsWith("m="));
  const parsed = params && /^m=(\d+),t=(\d+),p=(\d+)$/.exec(params);
  if (!parsed) return true;
  return (
    Number(parsed[1]) < ARGON2_PARAMS.memoryCost ||
    Number(parsed[2]) < ARGON2_PARAMS.timeCost ||
    Number(parsed[3]) < ARGON2_PARAMS.parallelism
  );
}

function passwordPolicyProblems(plain) {
  const value = String(plain ?? "");
  const problems = [];
  if (value.length < MIN_PASSWORD_LENGTH) {
    problems.push(
      `Գաղտնաբառը պետք է պարունակի առնվազն ${MIN_PASSWORD_LENGTH} նիշ`,
    );
  }
  if (COMMON_PASSWORDS.has(value.toLowerCase())) {
    problems.push("Այս գաղտնաբառը չափազանց տարածված է, ընտրեք այլ գաղտնաբառ");
  }
  return problems;
}

module.exports = {
  ARGON2_PARAMS,
  MIN_PASSWORD_LENGTH,
  COMMON_PASSWORDS,
  hashPassword,
  verifyPassword,
  needsRehash,
  passwordPolicyProblems,
  isBcryptHash,
  isArgon2idHash,
};
