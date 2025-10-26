// implementing regestrations, login and logouts and everything related to user

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, role, grade, tscNumber, nationalID, username } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      role,
      grade,
      nationalID,
      tscNumber,
      isVerified: false,
      verificationType: tscNumber ? 'tsc' : 'manual'
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
  console.log('Registration request received' );
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({token})

    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }   
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }  
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, password } = req.body;

    // Only allow updates to safe fields
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' , error: error.message });
  }
};





module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};