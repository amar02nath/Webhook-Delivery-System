const { Queue } = require("bullmq");
const Redis = require("ioredis");

const redisConnection = new Redis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  },
);

const webhookQueue = new Queue("webhook-delivery", {
  connection: redisConnection,
});

module.exports = { webhookQueue, redisConnection };
