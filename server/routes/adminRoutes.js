const express = require('express');
const { body, param, query } = require('express-validator');
const controller = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const handleValidation = require('../middleware/validators/handleValidation');
const { inventoryUpdateValidators } = require('../middleware/validators/inventoryValidators');

const router = express.Router();
router.use(auth, adminOnly);

router.get('/stats', controller.getStats);
router.get('/orders', [
  query('status').optional().isIn(Object.keys(controller.transitions)).withMessage('Invalid order status'),
], handleValidation, controller.getOrders);
router.patch('/orders/:orderId/status', [
  param('orderId').isMongoId().withMessage('A valid order ID is required'),
  body('newStatus').isIn(Object.keys(controller.transitions)).withMessage('Invalid order status'),
], handleValidation, controller.updateOrderStatus);
router.get('/inventory', controller.getInventory);
router.get('/inventory/low-stock', controller.getLowStockItems);
router.patch('/inventory/:ingredientId', inventoryUpdateValidators, handleValidation, controller.updateInventory);

module.exports = router;
