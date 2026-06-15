const express = require('express');
const controller = require('../controllers/orderController');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const handleValidation = require('../middleware/validators/handleValidation');
const {
  orderDetailsValidators,
  confirmValidators,
  orderIdValidator,
} = require('../middleware/validators/orderValidators');

const router = express.Router();

router.use(auth);
router.post('/create-razorpay-order', orderDetailsValidators, handleValidation, controller.createRazorpayOrder);
router.post('/confirm', confirmValidators, handleValidation, controller.confirmOrder);
router.get('/my-orders', controller.getMyOrders);
router.patch('/:orderId/status', adminOnly, [
  ...orderIdValidator,
  require('express-validator').body('newStatus')
    .isIn(Object.keys(adminController.transitions))
    .withMessage('Invalid order status'),
], handleValidation, adminController.updateOrderStatus);
router.get('/:orderId', orderIdValidator, handleValidation, controller.getOrder);

module.exports = router;
