const express = require("express");
const Food = require("../models/Food");
const axios = require("axios");
const mongoose = require("mongoose");
const router = express.Router();

// Utility function to convert date format
const convertDateFormat = (dateString) => {
  const parts = dateString.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// Add Food (no authentication required)
router.post("/add", async (req, res) => {
  const { name, expiryDate, quantity } = req.body;

  try {
    const formattedExpiryDate = convertDateFormat(expiryDate);

    const newFood = new Food({
      name,
      expiryDate: formattedExpiryDate,
      quantity,
      // Remove admin association
    });

    await newFood.save();
    res.json({ msg: "Food added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all Food items (no authentication required)
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find(); // Fetch all food items
    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get Food by ID (no authentication required)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid food ID format" });
  }

  try {
    const food = await Food.findById(id); // Fetch food by ID
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }
    res.json(food);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete Food by ID (no authentication required)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid food ID format" });
  }

  try {
    const food = await Food.findById(id); // Find food item by ID
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }

    await Food.findByIdAndDelete(id);
    res.json({ msg: "Food deleted" });
  } catch (error) {
    console.error("Error in DELETE /:id:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get Recipes by Food Name (no authentication required)
router.get("/recipes/by-name", async (req, res) => {
  const { foodName } = req.query;

  if (!foodName) {
    return res.status(400).json({ msg: "Food name is required" });
  }

  try {
    console.log("Fetching recipes for food name:", foodName); // Log the food name

    // Fetch food item from the database based on the food name
    const food = await Food.findOne({ name: foodName });

    if (!food) {
      return res.status(404).json({ msg: "No food item found in the database" });
    }

    // Fetch random recipes based on the food name
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        foodName
      )}&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    // Combine food item and recipes into a single response
    res.json({
      food,
      recipes: response.data,
    });
  } catch (error) {
    console.error("Error in /recipes/by-name route:", error); // Log the error
    res.status(500).json({ msg: "Error fetching recipes from Spoonacular" });
  }
});

module.exports = router;
