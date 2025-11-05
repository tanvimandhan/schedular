"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validate = void 0;
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const dataToValidate = source === 'body' ? req.body : source === 'params' ? req.params : req.query;
        const { error, value } = schema.validate(dataToValidate, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: errorMessages.join(', ')
            });
        }
        if (source === 'body') {
            req.body = value;
        }
        else if (source === 'params') {
            req.params = value;
        }
        else {
            req.query = value;
        }
        next();
    };
};
exports.validate = validate;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid parameters',
                message: error.details[0].message
            });
        }
        req.params = value;
        next();
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validation.js.map