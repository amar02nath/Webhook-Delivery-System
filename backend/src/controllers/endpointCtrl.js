const Endpoint = require("../models/Endpoint");
const DeliveryLog = require("../models/DeliveryLog");

exports.createEndpoint = async (req, res) => {
  try {
    const { url, events } = req.body;
    const newEndpoint = await Endpoint.create({ url, events });
    res.status(201).json(newEndpoint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEndpoints = async (req, res) => {
  try {
    const endpoints = await Endpoint.find().sort({ createdAt: -1 });
    res.status(200).json(endpoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEndpointLogs = async (req, res) => {
  try {
    const logs = await DeliveryLog.find({ endpointId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50); // Keep dashboard fast by limiting logs
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEndpoint = async (req, res) => {
  try {
    await Endpoint.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Endpoint deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEndpoint = async (req, res) => {
  try {
    const { events } = req.body;
    const endpoint = await Endpoint.findByIdAndUpdate(
      req.params.id,
      { events },
      { new: true },
    );
    res.status(200).json(endpoint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
