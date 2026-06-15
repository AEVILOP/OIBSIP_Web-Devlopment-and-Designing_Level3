const { body, param } = require('express-validator');

const inventoryUpdateValidators = [
  param('ingredientId').isMongoId().withMessage('A valid ingredient ID is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
    .toInt(),
];

module.exports = { inventoryUpdateValidators };
