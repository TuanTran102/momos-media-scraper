const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger.requestLogger);

const basicAuth = require('./middlewares/auth');

const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');

app.use('/api/public', publicRoutes);
app.use('/api', basicAuth, authRoutes);

app.use(errorHandler);

module.exports = app;
