const morgan = require('morgan');
const pino = require('pino');

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' ? {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    } : undefined
});

const requestLogger = morgan('tiny');

module.exports = {
    requestLogger,
    logger,
};
