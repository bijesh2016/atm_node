/**
 * Create a standardized error object
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @param {string} [details] - Additional error details
 * @returns {Error} Custom error object with status and message
 */
const createError = (status, message, details = null) => {
  const error = new Error(message);
  error.statusCode = status;
  error.status = `${status}`.startsWith('4') ? 'fail' : 'error';
  error.isOperational = true;
  
  if (details) {
    error.details = details;
  }
  
  // Capture stack trace
  Error.captureStackTrace(error, createError);
  
  return error;
};

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', {
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    err = createError(400, message);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    err = createError(400, message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = createError(401, 'Invalid token. Please log in again!');
  }
  if (err.name === 'TokenExpiredError') {
    err = createError(401, 'Your token has expired! Please log in again.');
  }

  // Send response to client
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.details && { details: err.details }),
  });
};

/**
 * Handle 404 Not Found errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFoundHandler = (req, res, next) => {
  next(createError(404, `Can't find ${req.originalUrl} on this server!`));
};

/**
 * Catch async/await errors in route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped middleware function with error handling
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = {
  createError,
  globalErrorHandler,
  notFoundHandler,
  catchAsync,
};
