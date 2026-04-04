const Endpoint = require("../models/Endpoint");
const DeliveryLog = require("../models/DeliveryLog");
const { webhookQueue } = require("../workers/queue");

exports.triggerEvent = async (req, res) => {
  try {
    const { event, payload } = req.body;

    // 1. Find all endpoints subscribed to this event
    const subscribers = await Endpoint.find({
      events: event,
      status: { $ne: "failing" },
    });

    if (subscribers.length === 0) {
      return res
        .status(200)
        .json({ message: "No active subscribers for this event." });
    }

    // 2. Create a pending Delivery Log and push to Queue for each subscriber
    for (const sub of subscribers) {
      const log = await DeliveryLog.create({
        endpointId: sub._id,
        event,
        payload,
        status: "pending",
      });

      // Push to BullMQ with Exponential Backoff configured
      await webhookQueue.add(
        "deliver-webhook",
        {
          logId: log._id,
          endpointId: sub._id,
          url: sub.url,
          secret: sub.secret,
          payload,
        },
        {
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 2000, // 2s, 4s, 8s, 16s...
          },
        },
      );
    }

    // 3. Return immediately! Do not wait for deliveries to finish.
    res.status(202).json({
      message: "Event triggered successfully.",
      deliveriesQueued: subscribers.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.retryDelivery = async (req, res) => {
  try {
    const { logId } = req.params;

    const log = await DeliveryLog.findById(logId).populate("endpointId");
    if (!log || log.status !== "failed") {
      return res
        .status(400)
        .json({ message: "Only permanently failed logs can be retried." });
    }

    // Reset the log status
    log.status = "pending";
    log.attemptCount = 0;
    await log.save();

    // Push back into BullMQ
    await webhookQueue.add(
      "deliver-webhook",
      {
        logId: log._id,
        endpointId: log.endpointId._id,
        url: log.endpointId.url,
        secret: log.endpointId.secret,
        payload: log.payload,
      },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
      },
    );

    res.status(202).json({ message: "Delivery queued for retry." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};