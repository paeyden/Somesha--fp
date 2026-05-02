const mongoose = require('mongoose');

const connectDB = async () => {
    const uri =
        process.env.MONGO_URI ||
        process.env.MONGODB_URI ||
        process.env.DATABASE_URL ||
        'mongodb://127.0.0.1:27017/somesha-dev';

    if (typeof uri !== 'string' || uri.trim() === '') {
        console.error('MongoDB connection failed: No connection string found.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully.....');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
