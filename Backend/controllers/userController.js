// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utility: generate JWT
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
};

// Utility: generate admission number
const generateAdmissionNumber = async (role) => {
  const prefix = role === "child" ? "CH" : role === "parent" ? "PA" : role === "tutor" ? "TU" : "AD";
  const year = new Date().getFullYear();
  const count = await User.countDocuments({ role });
  return `${prefix}-${year}-${String(count + 1).padStart(3, "0")}`;
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    name, email, password, role,
    grade, // child
    nationalID, tscNumber, // tutor identity
    username,
    parentId, // child registration
    children // parent registration
  } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Role-specific validation
    if (role === 'child' && !grade) {
      return res.status(400).json({ message: 'Grade is required for child accounts' });
    }
    if (role === 'tutor' && !nationalID) {
      return res.status(400).json({ message: 'National ID is required for tutors' });
    }
    if (role === 'tutor' && tscNumber && !tscNumber.trim()) {
      return res.status(400).json({ message: 'TSC Number cannot be empty if provided' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build user document
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      admissionNumber: await generateAdmissionNumber(role),
      grade: role === 'child' ? grade : undefined,
      children: role === 'parent' ? (Array.isArray(children) ? children : []) : [],
      nationalID: role === 'tutor' ? nationalID : undefined,
      tscNumber: role === 'tutor' ? tscNumber : undefined,
      verificationType: role === 'tutor' ? (tscNumber ? 'tsc' : 'manual') : undefined,
      isVerified: false,
    };

    if (username && username.trim() !== "") {
      userData.username = username.trim();
    }

    // Create user
    const user = await User.create(userData);

    // If child, link to parent
    if (role === 'child' && parentId) {
      await User.findByIdAndUpdate(parentId, { $push: { children: user._id } });
      user.parent = parentId;
      await user.save();
    }

    // For tutors, guide next step (create Tutor profile via tutorController)
    const nextStep =
      role === 'tutor'
        ? { next: 'Complete tutor profile', endpoint: '/api/tutors', method: 'POST' }
        : null;

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        admissionNumber: user.admissionNumber,
        isVerified: user.isVerified
      },
      nextStep
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      return res.status(400).json({ message: `Duplicate ${field}`, error: `${field} must be unique` });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        admissionNumber: user.admissionNumber,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user (client clears token)
// @route   POST /api/users/logout
// @access  Public
const logoutUser = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('children', 'name admissionNumber grade')
      .populate('parent', 'name admissionNumber email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password, children, grade, nationalID, tscNumber } = req.body;

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (user.role === 'parent' && Array.isArray(children)) {
      user.children = children;
    }
    if (user.role === 'child' && grade) {
      user.grade = grade;
    }
    if (user.role === 'tutor') {
      if (nationalID) user.nationalID = nationalID;
      if (typeof tscNumber === 'string' && tscNumber.trim().length > 0) {
        user.tscNumber = tscNumber.trim();
        user.verificationType = 'tsc';
      }
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        admissionNumber: user.admissionNumber,
        children: user.children,
        grade: user.grade,
        nationalID: user.nationalID,
        tscNumber: user.tscNumber,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// add child to parent 
// Assuming you have auth middleware that sets req.user = { id: ..., role: ... }
const addParentToChild = async (req, res) => {
  try {
    const parentId = req.user.id; // parent is authenticated
    const { childId, admissionNumber } = req.body;

    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "parent") {
      return res.status(404).json({ message: "Parent not found" });
    }

    let child;
    if (childId) {
      child = await User.findById(childId);
    } else if (admissionNumber) {
      child = await User.findOne({ admissionNumber });
    }

    if (!child || child.role !== "child") {
      return res.status(404).json({ message: "Child not found" });
    }

    // Link parent and child
    parent.children.push(child._id);
    child.parent = parent._id;

    await parent.save();
    await child.save();

    res.status(200).json({ message: "Child linked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addParentToChild,
};