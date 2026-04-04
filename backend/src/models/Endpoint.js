const mongoose = require("mongoose");
const crypto = require("crypto");

const endpointSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Webhook URL is required"],
      trim: true,
      match: [/^https?:\/\//, "Please enter a valid HTTP/HTTPS URL"],
    },
    // The secret used to sign the payload (auto-generated)
    secret: {
      type: String,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
    // e.g., ["user.created", "order.shipped"]
    events: [
      {
        type: String,
        required: true,
      },
    ],
    // Current health of the endpoint
    status: {
      type: String,
      enum: ["healthy", "degraded", "failing"],
      default: "healthy",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Endpoint", endpointSchema);
