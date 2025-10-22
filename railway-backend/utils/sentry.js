const Sentry = require('@sentry/node');
const logger = require('./logger');

// Initialize Sentry
const initSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
      integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app: true }),
      ],
    });
    logger.info('Sentry initialized');
  } else {
    logger.warn('Sentry DSN not provided, error tracking disabled');
  }
};

// Capture exception with additional context
const captureException = (error, context = {}) => {
  if (process.env.SENTRY_DSN) {
    Sentry.withScope(scope => {
      // Add additional context
      Object.keys(context).forEach(key => {
        scope.setExtra(key, context[key]);
      });
      
      // Capture exception
      Sentry.captureException(error);
    });
  }
  
  // Also log the error
  logger.error(error.message, { 
    stack: error.stack,
    ...context
  });
};

// Create Sentry request handler
const requestHandler = () => {
  if (process.env.SENTRY_DSN) {
    return Sentry.Handlers.requestHandler();
  }
  return (req, res, next) => next();
};

// Create Sentry error handler
const errorHandler = () => {
  if (process.env.SENTRY_DSN) {
    return Sentry.Handlers.errorHandler();
  }
  return (err, req, res, next) => next(err);
};

module.exports = {
  initSentry,
  captureException,
  requestHandler,
  errorHandler,
  Sentry
};