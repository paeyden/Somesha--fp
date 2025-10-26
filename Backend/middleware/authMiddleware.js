const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 🔐 Protect: verifies token and attaches user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 🛡️ Role-based access control
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

const restrictToTutor = (req, res, next) => {
  if (req.user.role !== 'tutor') {
    return res.status(403).json({ message: 'Tutor access only' });
  }
  next();
};

const restrictToParent = (req, res, next) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ message: 'Parent access only' });
  }
  next();
};

module.exports = {
  protect,
  restrictToAdmin,
  restrictToTutor,
  restrictToParent
};