const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Assuming you have a User model as Admin
const router = express.Router();
require('dotenv').config();

const secretKey = process.env.JWT_SECRET; // Ensure this is correct

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Store user info in request object
        next();
    });
};

// Register (for initial setup)
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Set default role to 'user' if not provided
    const userRole = role && ['admin', 'user'].includes(role) ? role : 'user';

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            role: userRole  // Save the determined role
        });

        await newAdmin.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ msg: 'Server error during registration' });
    }
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

        // Create JWT token with the role included
        const token = jwt.sign({ id: admin._id, role: admin.role }, secretKey, { expiresIn: '1h' });

        // Return the token and role in the response
        res.json({ token, role: admin.role }); // Include the role in the response
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ msg: 'Server error during login' });
    }
});

// Get User Profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password'); // Exclude password
        if (!admin) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(admin); // Return the admin profile
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ msg: 'Server error while fetching profile' });
    }
});

module.exports = router;
