const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    // Custom error handling
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(val => val.message)
        });
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry found'
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};

exports.notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
};