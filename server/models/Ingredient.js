const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 100,
  },
  threshold: {
    type: Number,
    min: 0,
    default: 20,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  imageEmoji: {
    type: String,
    default: '🍕',
  },
}, { timestamps: true });

module.exports = mongoose.model('Ingredient', ingredientSchema);
