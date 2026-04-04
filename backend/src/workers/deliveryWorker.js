const { Worker } = require("bullmq");
const DeliveryLog = require("../models/DeliveryLog");
const Endpoint = require("../models/Endpoint");
const { generateSignature } = require("../services/signature");
const { redisConnection } = require("./queue");

const worker = new Worker(
  "webhook-delivery",
  async (job) => {
    const { logId, endpointId, url, secret, payload } = job.data;
    const startTime = Date.now();
    const attemptCount = job.attemptsMade + 1;

    try {
      // 1. Sign the Payload
      const signature = generateSignature(payload, secret);

      // 2. Make the HTTP Request (with 5-second timeout)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Attempt": attemptCount.toString(),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      const responseTime = Date.now() - startTime;

      // Throw error if it's a 4xx or 5xx response
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // 3. On Success: Update Database
      await DeliveryLog.findByIdAndUpdate(logId, {
        status: "success",
        statusCode: response.status,
        responseTime,
        attemptCount,
      });

      await Endpoint.findByIdAndUpdate(endpointId, { status: "healthy" });

      return { success: true };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const isMaxRetries = attemptCount >= job.opts.attempts;

      // 4. On Failure: Update Database
      await DeliveryLog.findByIdAndUpdate(logId, {
        status: isMaxRetries ? "failed" : "pending",
        errorMessage: error.message,
        responseTime,
        attemptCount,
      });

      if (isMaxRetries) {
        await Endpoint.findByIdAndUpdate(endpointId, { status: "failing" });
      }

      // Throwing the error tells BullMQ to apply exponential backoff and retry later
      throw error;
    }
  },
  { connection: redisConnection },
);

worker.on("completed", (job) => {
  console.log(`✅ Webhook delivered: Job ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(
    `⚠️ Webhook failed (Attempt ${job.attemptsMade}): Job ${job.id} - ${err.message}`,
  );
});

module.exports = worker;
