// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const scanRoutes = require('./routes/scanRoutes');
const projectRoutes = require('./routes/projectRoutes');
const logger = require('./utils/logger');

const app = express();

// basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// logging
app.use(morgan('dev'));

// rate limiting (basic)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// static uploads (read-only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/scan', scanRoutes);
app.use('/api/projects', projectRoutes);

// health check
app.get('/', (req, res) => res.json({ status: 'ok', service: 'dependency-risk-backend' }));

// connect db & start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dependency_risk';

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', err);
    process.exit(1);
  });

  