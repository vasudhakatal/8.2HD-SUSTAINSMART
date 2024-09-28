const express = require('express');
const Food = require('../models/Food');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to check if admin is authenticated

// Utility function to convert date format from DD/MM/YYYY to YYYY-MM-DD
const convertDateFormat = (dateString) => {
  const parts = dateString.split('/');
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // Return YYYY-MM-DD format
};

// Add Food
router.post('/add', async (req, res) => {
  const { name, expiryDate, quantity } = req.body;

  try {
    // Convert the expiryDate to YYYY-MM-DD format
    const formattedExpiryDate = convertDateFormat(expiryDate);

    const newFood = new Food({
      name,
      expiryDate: formattedExpiryDate, // Use the converted date
      quantity,
    });

    await newFood.save();
    res.json({ msg: 'Food added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all Food
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find(); // Fetch all food items
    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id); // Fetch food by ID
    if (!food) {
      return res.status(404).json({ msg: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
