const Message = require('../models/message');
const User = require('../models/user');

// @desc    Send a message
// @route   POST /api/messages
// @access  Authenticated users
const sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get messages between two users
// @route   GET /api/messages/:userId
// @access  Authenticated users
const getMessagesWithUser = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getMessagesWithUser
};