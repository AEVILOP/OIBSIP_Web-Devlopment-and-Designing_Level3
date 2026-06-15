const { body, param } = require('express-validator');

const optionalIdArray = (field) => body(field)
  .optional()
  .isArray()
  .withMessage(`${field} must be an array`)
  .custom((ids) => ids.every((id) => /^[a-f\d]{24}$/i.test(id)))
  .withMessage(`${field} contains an invalid ingredient ID`);

const orderDetailsValidators = [
  body('orderType').isIn(['custom', 'menu']).withMessage('Order type must be custom or menu'),
  body('pizzaVarietyId')
    .if(body('orderType').equals('menu'))
    .isMongoId()
    .withMessage('A valid pizza variety is required'),
  body('baseId')
    .if(body('orderType').equals('custom'))
    .isMongoId()
    .withMessage('A valid base is required'),
  body('sauceId')
    .if(body('orderType').equals('custom'))
    .isMongoId()
    .withMessage('A valid sauce is required'),
  body('cheeseId')
    .if(body('orderType').equals('custom'))
    .isMongoId()
    .withMessage('A valid cheese is required'),
  optionalIdArray('veggieIds'),
  optionalIdArray('meatIds'),
];

const confirmValidators = [
  body('razorpayOrderId').isString().notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpayPaymentId').isString().notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpaySignature').isString().notEmpty().withMessage('Payment signature is required'),
  ...orderDetailsValidators,
];

const orderIdValidator = [
  param('orderId').isMongoId().withMessage('A valid order ID is required'),
];

module.exports = { orderDetailsValidators, confirmValidators, orderIdValidator };
