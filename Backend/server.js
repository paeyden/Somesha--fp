
const express = require('express');
// Load env vars as early as possible
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Somesha API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port:http://localhost:${PORT}`);
});

module.exports = app;
