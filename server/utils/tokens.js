const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const createOneTimeToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return { token, hashedToken: hashToken(token) };
};

const signAccessToken = (user) => jwt.sign(
  { sub: user._id.toString(), role: user.role },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' },
);

const signRefreshToken = (user) => jwt.sign(
  { sub: user._id.toString(), type: 'refresh' },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' },
);

module.exports = {
  createOneTimeToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
};
