const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const auth = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authorization.slice(7);
  let payload;

  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Your session token has expired',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const user = await User.findById(payload.sub).select('_id name email role isVerified');
  if (!user) return res.status(401).json({ error: 'User account no longer exists' });
  if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email before continuing' });

  req.user = user;
  return next();
});

module.exports = auth;
