const cron = require('node-cron');
const Ingredient = require('../models/Ingredient');
const { sendLowStockEmail } = require('./emailService');

let lastAlertSentAt = 0;
const SIX_HOURS = 6 * 60 * 60 * 1000;

const getLowStock = () => Ingredient.find({
  isAvailable: true,
  $expr: { $lte: ['$stock', '$threshold'] },
}).sort({ stock: 1 });

const checkLowStock = async ({ force = false } = {}) => {
  try {
    if (!force && Date.now() - lastAlertSentAt < SIX_HOURS) return;
    const lowStockItems = await getLowStock();
    if (!lowStockItems.length) return;

    const sent = await sendLowStockEmail(lowStockItems);
    if (sent) lastAlertSentAt = Date.now();
  } catch (error) {
    console.error('Low stock check failed:', error.message);
  }
};

const startStockCron = () => {
  cron.schedule('0 * * * *', checkLowStock);
  console.log('Hourly low-stock monitor started');
};

module.exports = { startStockCron, checkLowStock, getLowStock };
