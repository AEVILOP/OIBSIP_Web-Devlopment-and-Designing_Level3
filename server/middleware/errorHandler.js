const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Value';
    return res.status(409).json({ error: `${field} already exists` });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  console.error(err);
  return res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
