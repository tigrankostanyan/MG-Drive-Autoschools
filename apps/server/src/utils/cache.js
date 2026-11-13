const redis = require("./redisClient");
// Cache helpers; failures degrade to a miss and values are JSON round-tripped.
module.exports = {
  async get(key) {
    try {
      const raw = await redis.get(key);
      if (raw === null || raw === undefined) return null;
      // The in-memory fallback can hold already-deserialized values.
      if (typeof raw !== "string") return raw;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Redis GET error:", e.message);
      return null;
    }
  },
  async set(key, value, ttl) {
    try {
      await redis.set(
        key,
        JSON.stringify(value),
        ttl ? { EX: ttl } : undefined,
      );
      return true;
    } catch (e) {
      console.error("Redis SET error:", e.message);
      return false;
    }
  },
  async del(key) {
    try {
      await redis.del(key);
    } catch (e) {
      console.error("Redis DEL error:", e);
    }
  },
};
