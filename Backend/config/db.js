const mongoose = require('mongoose');

/**
 * Connect to MongoDB with validation and helpful defaults.
 * - Tries several common env var names: MONGO_URI, MONGODB_URI, DATABASE_URL
 * - Falls back to a local MongoDB instance if none provided
 * - Ensures the value passed to mongoose.connect is a string
 */
const connectDB = async () => {
    // Accept multiple common environment variable names
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/somesha-dev';

    if (typeof uri !== 'string' || uri.trim() === '') {
        console.error('MongoDB connection failed: No connection string found. Make sure MONGO_URI (or MONGODB_URI / DATABASE_URL) is set.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.....');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;