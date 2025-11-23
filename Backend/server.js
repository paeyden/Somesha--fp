const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();


// =======================
//   FIXED CORS CONFIG
// =======================

// allowed frontend origins
const allowedOrigins = [
  "https://somesha-fp.vercel.app",   // your frontend
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Allow OPTIONS preflight
app.options("*", cors());


// =======================
//   SECURITY + JSON
// =======================
app.use(express.json());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// =======================
//     CONNECT DB
// =======================
connectDB();


// =======================
//       ROUTES
// =======================
app.use('/api/users', userRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);


// =======================
//     ROOT ENDPOINT
// =======================
app.get('/', (req, res) => {
  res.send('Welcome to the Somesha API - Backend running successfully');
});


// =======================
//        404
// =======================
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});


// =======================
//   GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);
  res.status(500).json({ message: 'Server error', error: err.message });
});


// =======================
//       START SERVER
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
