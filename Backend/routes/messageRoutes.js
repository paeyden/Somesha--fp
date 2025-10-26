const express = require('express');
const router = express.Router();
const{ sendMessage, getMessagesWithUser } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/messages → Send a message (Authenticated users)
router.post('/', protect, sendMessage);
// GET /api/messages/:userId → Get messages with a specific user (Authenticated users)
router.get('/:userId', protect, getMessagesWithUser);

module.exports = router;