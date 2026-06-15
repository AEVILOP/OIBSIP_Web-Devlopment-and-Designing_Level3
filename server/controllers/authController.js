const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const {
  createOneTimeToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
} = require('../utils/tokens');
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require('../utils/emailService');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const existing = await User.exists({ email: normalizedEmail });

  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const { token, hashedToken } = createOneTimeToken();
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    role: normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user',
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    lastVerificationSent: new Date(),
  });

  await sendVerificationEmail(user, token);
  return res.status(201).json({ message: 'Check your email to verify your account' });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.query.token);
  const user = await User.findOne({ emailVerificationToken: hashedToken })
    .select('+emailVerificationToken +emailVerificationExpires');

  if (!user) return res.status(400).json({ error: 'Invalid verification link.' });
  if (user.isVerified) {
    return res.status(200).json({ message: 'Your email is already verified. Please log in.' });
  }
  if (!user.emailVerificationExpires || user.emailVerificationExpires <= Date.now()) {
    return res.status(400).json({ error: 'Verification link has expired. Request a new one.' });
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  void sendWelcomeEmail(user);
  return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
});

const resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
    .select('+lastVerificationSent +emailVerificationToken +emailVerificationExpires');

  if (!user) {
    return res.status(200).json({ message: 'If the account exists, a verification email has been sent' });
  }
  if (user.isVerified) {
    return res.status(200).json({ message: 'This email is already verified' });
  }
  if (user.lastVerificationSent && Date.now() - user.lastVerificationSent.getTime() < 2 * 60 * 1000) {
    return res.status(429).json({ error: 'Please wait before requesting another email' });
  }

  const { token, hashedToken } = createOneTimeToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  user.lastVerificationSent = new Date();
  await user.save();
  await sendVerificationEmail(user, token);

  return res.status(200).json({ message: 'If the account exists, a verification email has been sent' });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() })
    .select('+password +refreshToken');

  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  if (!user.isVerified) {
    return res.status(403).json({
      error: 'Please verify your email before logging in',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }

  const passwordMatches = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatches) return res.status(401).json({ error: 'Invalid email or password' });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = hashToken(refreshToken);
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions());
  return res.status(200).json({ accessToken, user: publicUser(user) });
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (_error) {
    res.clearCookie('refreshToken', cookieOptions());
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await User.findById(payload.sub).select('+refreshToken');
  if (!user || !user.refreshToken || user.refreshToken !== hashToken(token)) {
    res.clearCookie('refreshToken', cookieOptions());
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.status(200).json({
    accessToken: signAccessToken(user),
    user: publicUser(user),
  });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      await User.updateOne(
        { _id: payload.sub, refreshToken: hashToken(token) },
        { $set: { refreshToken: null } },
      );
    } catch (_error) {
      // Clearing an invalid or expired cookie is still a successful logout.
    }
  }

  res.clearCookie('refreshToken', cookieOptions());
  return res.status(200).json({ message: 'Logged out successfully' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const response = { message: "If this email exists, you'll receive reset instructions" };
  const user = await User.findOne({ email: req.body.email.toLowerCase(), isVerified: true })
    .select('+passwordResetToken +passwordResetExpires');

  if (!user) return res.status(200).json(response);

  const { token, hashedToken } = createOneTimeToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save();
  await sendPasswordResetEmail(user, token);

  return res.status(200).json(response);
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.query.token);
  const user = await User.findOne({ passwordResetToken: hashedToken })
    .select('+password +passwordResetToken +passwordResetExpires +refreshToken');

  if (!user) return res.status(400).json({ error: 'Invalid reset link.' });
  if (!user.passwordResetExpires || user.passwordResetExpires <= Date.now()) {
    return res.status(400).json({ error: 'Reset link has expired. Request a new one.' });
  }
  if (await bcrypt.compare(req.body.newPassword, user.password)) {
    return res.status(400).json({ error: 'New password must be different from current password' });
  }

  user.password = await bcrypt.hash(req.body.newPassword, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null;
  await user.save();

  res.clearCookie('refreshToken', cookieOptions());
  return res.status(200).json({ message: 'Password reset successfully. Please log in.' });
});

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
