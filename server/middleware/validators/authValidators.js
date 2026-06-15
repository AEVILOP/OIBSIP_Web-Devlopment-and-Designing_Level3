const { body, query } = require('express-validator');

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

const passwordRule = (field = 'password') => body(field)
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter')
  .matches(/\d/)
  .withMessage('Password must contain a number')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must contain a special character');

const registerValidators = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  emailRule,
  passwordRule(),
];

const loginValidators = [
  emailRule,
  body('password').isString().notEmpty().withMessage('Password is required'),
];

const emailValidators = [emailRule];
const resetPasswordValidators = [
  query('token').isString().notEmpty().withMessage('Reset token is required'),
  passwordRule('newPassword'),
];
const verificationValidators = [
  query('token').isString().notEmpty().withMessage('Verification token is required'),
];

module.exports = {
  registerValidators,
  loginValidators,
  emailValidators,
  resetPasswordValidators,
  verificationValidators,
};
