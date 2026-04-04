const express = require("express");
const router = express.Router();
const {
  createEndpoint,
  getEndpoints,
  getEndpointLogs,
  deleteEndpoint,
  updateEndpoint,
} = require("../controllers/endpointCtrl");

router.post("/", createEndpoint);
router.get("/", getEndpoints);
router.get("/:id/logs", getEndpointLogs);

// Add the two missing routes right here!
router.delete("/:id", deleteEndpoint);
router.put("/:id", updateEndpoint);

module.exports = router;
