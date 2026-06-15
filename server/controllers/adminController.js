const Order = require('../models/Order');
const Ingredient = require('../models/Ingredient');
const asyncHandler = require('../utils/asyncHandler');
const { getLowStock } = require('../utils/stockCron');

const transitions = {
  pending: ['order_received', 'cancelled'],
  order_received: ['in_kitchen', 'cancelled'],
  in_kitchen: ['sent_to_delivery', 'cancelled'],
  sent_to_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const getInventory = asyncHandler(async (_req, res) => {
  const ingredients = await Ingredient.find().sort({ category: 1, name: 1 });
  const grouped = ingredients.reduce((result, ingredient) => {
    if (!result[ingredient.category]) result[ingredient.category] = [];
    result[ingredient.category].push(ingredient);
    return result;
  }, {});
  res.json({ ingredients, grouped });
});

const updateInventory = asyncHandler(async (req, res) => {
  const ingredient = await Ingredient.findByIdAndUpdate(
    req.params.ingredientId,
    { stock: req.body.stock, isAvailable: req.body.stock > 0 },
    { new: true, runValidators: true },
  );

  if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' });
  return res.json({ ingredient });
});

const getLowStockItems = asyncHandler(async (_req, res) => {
  const ingredients = await Ingredient.find({
    $expr: { $lte: ['$stock', '$threshold'] },
  }).sort({ stock: 1 });
  res.json({ ingredients });
});

const getOrders = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('pizzaVariety', 'name')
    .sort({ createdAt: -1 });
  res.json({ orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const validTransitions = transitions[order.status];
  if (!validTransitions.includes(req.body.newStatus)) {
    return res.status(400).json({
      error: `Invalid status transition. Valid transitions: ${validTransitions.join(', ') || 'none'}`,
      validTransitions,
    });
  }

  order.status = req.body.newStatus;
  await order.save();
  return res.json({ order });
});

const getStats = asyncHandler(async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [todayStats, pendingOrders, lowStockItems] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday }, paymentStatus: 'paid' } },
      { $group: { _id: null, totalOrders: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments({ status: { $in: ['pending', 'order_received', 'in_kitchen'] } }),
    Ingredient.find({ $expr: { $lte: ['$stock', '$threshold'] } }),
  ]);

  res.json({
    stats: {
      totalOrdersToday: todayStats[0]?.totalOrders || 0,
      revenueToday: todayStats[0]?.revenue || 0,
      pendingOrders,
      lowStockItems: lowStockItems.length,
    },
  });
});

module.exports = {
  transitions,
  getInventory,
  updateInventory,
  getLowStockItems,
  getOrders,
  updateOrderStatus,
  getStats,
};
