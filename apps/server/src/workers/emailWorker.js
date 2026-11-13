const Queue = require("bull");
const Email = require("../utils/Email");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const redisSocket = process.env.REDIS_SOCKET;
const redisConnection = redisSocket
  ? { redis: { path: redisSocket } }
  : process.env.REDIS_URL || "redis://127.0.0.1:6379";
const jobQueue = new Queue("background-jobs", redisConnection);
jobQueue.process(5, async (job) => {
  console.log(`[Job] Processing ${job.name || "default"} (ID: ${job.id})`);
  try {
    if (job.name === "sendEmail" || job.data.type === "sendEmail") {
      const { user, url, data, template, subject } = job.data;
      const emailService = new Email(user, url, data);
      await emailService.send(template, subject);
      console.log(`[Job] Email sent to ${user.email} (Template: ${template})`);
    }
  } catch (err) {
    console.error(`[Job] Failed ${job.id}: ${err.message}`);
    throw err; 
  }
});
jobQueue.on("completed", (job) => {
  console.log(`[Job] Completed ${job.id}`);
});
jobQueue.on("failed", (job, err) => {
  console.error(`[Job] Failed ${job.id} has failed with ${err.message}`);
});
console.log("Worker started...");
