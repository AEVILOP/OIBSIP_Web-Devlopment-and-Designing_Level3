const mongoose = require('mongoose');

const selectedIngredientSchema = new mongoose.Schema({
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  orderType: {
    type: String,
    enum: ['custom', 'menu'],
    required: true,
  },
  pizzaVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PizzaVariety',
    default: null,
  },
  customization: {
    base: selectedIngredientSchema,
    sauce: selectedIngredientSchema,
    cheese: selectedIngredientSchema,
    veggies: [selectedIngredientSchema],
    meats: [selectedIngredientSchema],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'order_received', 'in_kitchen', 'sent_to_delivery', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
    unique: true,
    sparse: true,
  },
  razorpayPaymentId: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
