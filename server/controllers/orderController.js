const crypto = require('crypto');
const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const getRazorpay = require('../utils/razorpay');
const { calculateOrder } = require('../utils/orderPricing');
const { checkLowStock } = require('../utils/stockCron');

const detailsFromBody = (body) => ({
  orderType: body.orderType,
  pizzaVarietyId: body.pizzaVarietyId,
  baseId: body.baseId,
  sauceId: body.sauceId,
  cheeseId: body.cheeseId,
  veggieIds: body.veggieIds || [],
  meatIds: body.meatIds || [],
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const pricedOrder = await calculateOrder(detailsFromBody(req.body));
  const amount = Math.round(pricedOrder.totalPrice * 100);
  const razorpayOrder = await getRazorpay().orders.create({
    amount,
    currency: 'INR',
    receipt: `pizza_${req.user._id.toString().slice(-8)}_${Date.now()}`,
    notes: {
      userId: req.user._id.toString(),
      orderType: req.body.orderType,
    },
  });

  return res.status(201).json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

const confirmOrder = asyncHandler(async (req, res) => {
  const existing = await Order.findOne({ razorpayOrderId: req.body.razorpayOrderId });
  if (existing) {
    if (existing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'This payment belongs to another account' });
    }
    return res.status(200).json({ order: existing, message: 'Order was already confirmed' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${req.body.razorpayOrderId}|${req.body.razorpayPaymentId}`)
    .digest('hex');

  const supplied = Buffer.from(req.body.razorpaySignature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const pricedOrder = await calculateOrder(detailsFromBody(req.body), { session });
      const remoteOrder = await getRazorpay().orders.fetch(req.body.razorpayOrderId);
      const expectedAmount = Math.round(pricedOrder.totalPrice * 100);

      if (
        remoteOrder.amount !== expectedAmount
        || remoteOrder.currency !== 'INR'
        || remoteOrder.notes?.userId !== req.user._id.toString()
      ) {
        const error = new Error('Payment amount does not match the order total');
        error.status = 400;
        throw error;
      }

      for (const item of pricedOrder.stockItems) {
        const updated = await Ingredient.findOneAndUpdate(
          { _id: item._id, stock: { $gt: 0 }, isAvailable: true },
          [
            {
              $set: {
                stock: { $subtract: ['$stock', 1] },
                isAvailable: { $gt: [{ $subtract: ['$stock', 1] }, 0] },
              },
            },
          ],
          { new: true, session },
        );

        if (!updated) {
          const error = new Error(`${item.name} went out of stock before checkout completed`);
          error.status = 409;
          throw error;
        }
      }

      const [order] = await Order.create([{
        user: req.user._id,
        orderType: req.body.orderType,
        pizzaVariety: pricedOrder.pizzaVariety?._id || null,
        customization: pricedOrder.customization,
        totalPrice: pricedOrder.totalPrice,
        status: 'pending',
        paymentStatus: 'paid',
        razorpayOrderId: req.body.razorpayOrderId,
        razorpayPaymentId: req.body.razorpayPaymentId,
      }], { session });
      createdOrder = order;
    });
  } finally {
    await session.endSession();
  }

  void checkLowStock();
  return res.status(201).json({ order: createdOrder });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('pizzaVariety', 'name image category')
    .sort({ createdAt: -1 });
  res.json({ orders });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('pizzaVariety', 'name image category')
    .populate('user', 'name email');

  if (!order) return res.status(404).json({ error: 'Order not found' });
  const ownerId = order.user._id.toString();
  if (ownerId !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You do not have permission to view this order' });
  }
  return res.json({ order });
});

module.exports = {
  createRazorpayOrder,
  confirmOrder,
  getMyOrders,
  getOrder,
};
