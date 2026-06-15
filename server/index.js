require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./utils/db');
const seedData = require('./utils/seedData');
const { startStockCron } = require('./utils/stockCron');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const requiredSecrets = ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
for (const key of requiredSecrets) {
  if (!process.env[key] || process.env[key].length < 64) {
    console.error(`${key} must be configured with at least 64 characters`);
    process.exit(1);
  }
}

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a few minutes.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => ['/refresh-token', '/logout'].includes(req.path),
  message: { error: 'Too many authentication attempts. Please wait 15 minutes.' },
});

app.use('/api', globalLimiter);
app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
}));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'API route not found' }));
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    await connectDatabase();
    await seedData();
    startStockCron();
    app.listen(port, () => console.log(`PizzaApp API listening on port ${port}`));
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

if (require.main === module) start();

module.exports = app;
