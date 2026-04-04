const express = require("express");
const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  const attempt = req.headers["x-webhook-attempt"];
  console.log(`\n📥 Received Webhook Attempt #${attempt}`);

  if (Math.random() < 0.8) {
    console.log("💥 Simulating Server Crash! Returning 500.");
    return res.status(500).send("Internal Server Error");
  }

  console.log("✅ Simulating Success! Returning 200.");
  res.status(200).send("OK");
});

app.listen(4000, () =>
  console.log("🎯 Test Receiver listening on http://localhost:4000/webhook"),
);
