"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Database constraint errors
    if (err.name === 'error' && err.code === '23505') {
        return res.status(409).json({
            success: false,
            error: 'Conflict',
            message: 'A slot already exists for this day and time'
        });
    }
    // Database foreign key errors
    if (err.name === 'error' && err.code === '23503') {
        return res.status(400).json({
            success: false,
            error: 'Invalid reference',
            message: 'Referenced slot does not exist'
        });
    }
    // Default error response
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map