const crypto = require("crypto");

exports.generateSignature = (payload, secret) => {
  // Ensure payload is a string before hashing
  const stringPayload =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  return crypto
    .createHmac("sha256", secret)
    .update(stringPayload)
    .digest("hex");
};
