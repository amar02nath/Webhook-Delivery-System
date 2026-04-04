const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Fallback to local MongoDB if no .env variable is set
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webhook-engine';
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1); // Stop the server if the database fails
    }
};

module.exports = connectDB;