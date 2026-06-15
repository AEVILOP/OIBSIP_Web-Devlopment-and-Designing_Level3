const mongoose = require('mongoose');

const pizzaVarietySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['veg', 'non-veg', 'vegan', 'drink', 'combo'],
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('PizzaVariety', pizzaVarietySchema);
