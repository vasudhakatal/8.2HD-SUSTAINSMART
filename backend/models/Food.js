const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Ensure this field exists
});

module.exports = mongoose.model('Food', FoodSchema);
