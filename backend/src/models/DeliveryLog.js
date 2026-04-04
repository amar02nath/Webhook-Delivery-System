const mongoose = require("mongoose");

const deliveryLogSchema = new mongoose.Schema(
  {
    endpointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endpoint",
      required: true,
      index: true, // Speeds up queries when fetching logs for a specific endpoint
    },
    event: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed, // Stores the JSON body of the event
      required: true,
    },
    // 'pending' (in queue), 'success' (2xx), or 'failed' (5xx / timeout)
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    statusCode: {
      type: Number, // The HTTP status code returned by the receiver
      default: null,
    },
    responseTime: {
      type: Number, // Measured in milliseconds
      default: null,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    nextRetryAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String, // Useful if the request timed out or DNS failed
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DeliveryLog", deliveryLogSchema);
