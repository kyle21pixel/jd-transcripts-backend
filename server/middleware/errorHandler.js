class ErrorHandler {
  // Handle different types of errors
  static handleError(error, req, res, next) {
    console.error('Error occurred:', error);

    // Database connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again later.',
        error: 'SERVICE_UNAVAILABLE'
      });
    }

    // Database query errors
    if (error.code && error.code.startsWith('ER_')) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred. Please try again.',
        error: 'DATABASE_ERROR'
      });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token provided.',
        error: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
        error: 'TOKEN_EXPIRED'
      });
    }

    // File upload errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum allowed size is 100MB.',
        error: 'FILE_TOO_LARGE'
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded. Maximum allowed is 10 files.',
        error: 'TOO_MANY_FILES'
      });
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors || [error.message],
        error: 'VALIDATION_ERROR'
      });
    }

    // Rate limiting errors
    if (error.message && error.message.includes('Too many requests')) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Email service errors
    if (error.message && error.message.includes('email')) {
      return res.status(500).json({
        success: false,
        message: 'Email service temporarily unavailable. Your request was processed but notification emails may be delayed.',
        error: 'EMAIL_SERVICE_ERROR'
      });
    }

    // Socket.IO errors
    if (error.message && error.message.includes('socket')) {
      console.error('Socket.IO error:', error);
      // Don't send response for socket errors, just log them
      return;
    }

    // Default error response
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'An unexpected error occurred';

    res.status(statusCode).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred. Please try again later.'
        : message,
      error: process.env.NODE_ENV === 'production' 
        ? 'INTERNAL_SERVER_ERROR'
        : error.name || 'UNKNOWN_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
  }

  // Handle 404 errors
  static handleNotFound(req, res, next) {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
      error: 'NOT_FOUND'
    });
  }

  // Handle async errors
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // Create custom error
  static createError(message, statusCode = 500, name = 'CustomError') {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.name = name;
    return error;
  }

  // Validation error creator
  static createValidationError(errors) {
    const error = new Error('Validation failed');
    error.name = 'ValidationError';
    error.statusCode = 400;
    error.errors = errors;
    return error;
  }

  // Database error handler
  static handleDatabaseError(error) {
    console.error('Database error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return this.createError('Duplicate entry found', 409, 'DuplicateError');
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return this.createError('Referenced record not found', 404, 'ReferenceError');
    }

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return this.createError('Cannot delete record as it is referenced by other records', 409, 'ReferenceError');
    }

    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return this.createError('Invalid field name in query', 400, 'QueryError');
    }

    if (error.code === 'ER_PARSE_ERROR') {
      return this.createError('Invalid SQL query', 400, 'QueryError');
    }

    return this.createError('Database operation failed', 500, 'DatabaseError');
  }

  // File upload error handler
  static handleFileUploadError(error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return this.createError('File size exceeds maximum allowed limit', 400, 'FileSizeError');
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return this.createError('Too many files uploaded', 400, 'FileCountError');
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return this.createError('Unexpected file field', 400, 'FileFieldError');
    }

    return this.createError('File upload failed', 500, 'FileUploadError');
  }

  // Authentication error handler
  static handleAuthError(error) {
    if (error.name === 'JsonWebTokenError') {
      return this.createError('Invalid authentication token', 401, 'AuthError');
    }

    if (error.name === 'TokenExpiredError') {
      return this.createError('Authentication token has expired', 401, 'AuthError');
    }

    if (error.message === 'User not found') {
      return this.createError('Invalid credentials', 401, 'AuthError');
    }

    if (error.message === 'Invalid password') {
      return this.createError('Invalid credentials', 401, 'AuthError');
    }

    return this.createError('Authentication failed', 401, 'AuthError');
  }

  // Log error with context
  static logError(error, req, additionalInfo = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.userId || 'anonymous',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      ...additionalInfo
    };

    console.error('Error Log:', JSON.stringify(errorLog, null, 2));
  }

  // Send error notification (for critical errors)
  static async notifyError(error, req) {
    // In production, you might want to send this to a monitoring service
    // like Sentry, LogRocket, or your own error tracking system
    
    const criticalError = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      userId: req.user?.userId || 'anonymous',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    };

    console.error('CRITICAL ERROR:', criticalError);
    
    // You could also send an email to administrators here
    // await emailService.sendErrorNotification(criticalError);
  }
}

module.exports = ErrorHandler;




