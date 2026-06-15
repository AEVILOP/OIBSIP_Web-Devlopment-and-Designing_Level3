const express = require('express');
const controller = require('../controllers/authController');
const handleValidation = require('../middleware/validators/handleValidation');
const {
  registerValidators,
  loginValidators,
  emailValidators,
  resetPasswordValidators,
  verificationValidators,
} = require('../middleware/validators/authValidators');

const router = express.Router();

router.post('/register', registerValidators, handleValidation, controller.register);
router.post('/verify-email', verificationValidators, handleValidation, controller.verifyEmail);
router.post('/resend-verification', emailValidators, handleValidation, controller.resendVerification);
router.post('/login', loginValidators, handleValidation, controller.login);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', controller.logout);
router.post('/forgot-password', emailValidators, handleValidation, controller.forgotPassword);
router.post('/reset-password', resetPasswordValidators, handleValidation, controller.resetPassword);

module.exports = router;
