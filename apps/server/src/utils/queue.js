const Queue = require("bull");
const redisSocket = process.env.REDIS_SOCKET;
const redisConnection = redisSocket
  ? { redis: { path: redisSocket } }
  : process.env.REDIS_URL || "redis://127.0.0.1:6379";
const jobQueue = new Queue("background-jobs", redisConnection);
module.exports = { jobQueue };
