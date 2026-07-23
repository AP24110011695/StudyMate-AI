const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const pdfRoutes = require('./routes/pdf.routes');
const chatRoutes = require('./routes/chat.routes');
const studyRoutes = require('./routes/study.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(logger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/study', studyRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
