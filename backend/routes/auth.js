const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

// Register (for initial setup)
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
  
    // Validate the role if needed
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).send('Invalid role');
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const newAdmin = new Admin({ 
      username, 
      password: hashedPassword,
      role  // Save the role provided by the request
    });
  
    await newAdmin.save();
    res.send('Admin registered');
  });
  

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ msg: 'Please provide both username and password.' });
    }
  
    try {
      // Find the admin by username
      const admin = await Admin.findOne({ username });
  
      // Check if the admin exists
      if (!admin) {
        return res.status(400).json({ msg: 'Admin not found' });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Create JWT token with the role included (assuming `role` field exists in your schema)
      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Return the token in the response
      res.json({ token });
    } catch (err) {
      console.error(err);
      // Return a 500 server error response
      res.status(500).json({ msg: 'Server error' });
    }
  });

module.exports = router;
