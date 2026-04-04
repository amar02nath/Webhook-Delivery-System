require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Add this

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/endpoints", require("./routes/endpoints"));
app.use("/api/events", require("./routes/events"));

// Start the background worker
require('./workers/deliveryWorker');

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// DELETE an endpoint
app.delete('/api/endpoints/:id', async (req, res) => {
    try {
        await Endpoint.findByIdAndDelete(req.params.id);
        res.json({ message: 'Endpoint deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete endpoint' });
    }
});

// UPDATE an endpoint (e.g., change the URL or events)
app.put('/api/endpoints/:id', async (req, res) => {
    try {
        const { url, events } = req.body;
        const updatedEndpoint = await Endpoint.findByIdAndUpdate(
            req.params.id, 
            { url, events }, 
            { new: true } // Returns the updated document
        );
        res.json(updatedEndpoint);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update endpoint' });
    }
});