const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const pdfRoutes = require('./routes/pdf.routes');
const chatRoutes = require('./routes/chat.routes');
const studyRoutes = require('./routes/study.routes');

const app = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// CORS configuration for production readiness
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging (avoid sensitive logs in production)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
  app.use(logger);
} else {
  // Use combined format for production to log standard Apache combined log output
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400
  }));
}

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/study', studyRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
