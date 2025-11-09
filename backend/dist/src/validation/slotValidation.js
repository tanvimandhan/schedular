"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExceptionSchema = exports.createExceptionSchema = exports.updateSlotSchema = exports.createSlotSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSlotSchema = joi_1.default.object({
    title: joi_1.default.string().required().min(1).max(100),
    description: joi_1.default.string().max(500).allow(''),
    day_of_week: joi_1.default.number().integer().min(0).max(6).required(),
    start_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    end_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    is_recurring: joi_1.default.boolean().default(true),
    effective_from: joi_1.default.date().iso().required(),
    effective_until: joi_1.default.date().iso().greater(joi_1.default.ref('effective_from')).allow(null)
}).custom((value, helpers) => {
    // Validate that start_time is before end_time
    const start = new Date(`2000-01-01T${value.start_time}:00`);
    const end = new Date(`2000-01-01T${value.end_time}:00`);
    if (start >= end) {
        return helpers.error('any.invalid', { message: 'Start time must be before end time' });
    }
    return value;
});
exports.updateSlotSchema = joi_1.default.object({
    date: joi_1.default.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(), // Optional date for exception creation
    title: joi_1.default.string().min(1).max(100),
    description: joi_1.default.string().max(500).allow(''),
    day_of_week: joi_1.default.number().integer().min(0).max(6),
    start_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    is_recurring: joi_1.default.boolean(),
    effective_from: joi_1.default.date().iso(),
    effective_until: joi_1.default.date().iso().allow(null),
    is_active: joi_1.default.boolean()
}).custom((value, helpers) => {
    // If both start_time and end_time are provided, validate start < end
    if (value.start_time && value.end_time) {
        const start = new Date(`2000-01-01T${value.start_time}:00`);
        const end = new Date(`2000-01-01T${value.end_time}:00`);
        if (start >= end) {
            return helpers.error('any.invalid', { message: 'Start time must be before end time' });
        }
    }
    return value;
});
exports.createExceptionSchema = joi_1.default.object({
    slot_id: joi_1.default.string().uuid().required(),
    exception_date: joi_1.default.date().iso().required(),
    start_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
    end_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
    is_cancelled: joi_1.default.boolean().default(false),
    reason: joi_1.default.string().max(500).allow('')
}).custom((value, helpers) => {
    // If not cancelled and times are provided, validate start < end
    if (!value.is_cancelled && value.start_time && value.end_time) {
        const start = new Date(`2000-01-01T${value.start_time}:00`);
        const end = new Date(`2000-01-01T${value.end_time}:00`);
        if (start >= end) {
            return helpers.error('any.invalid', { message: 'Start time must be before end time' });
        }
    }
    return value;
});
exports.updateExceptionSchema = joi_1.default.object({
    start_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
    end_time: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
    is_cancelled: joi_1.default.boolean(),
    reason: joi_1.default.string().max(500).allow('')
}).custom((value, helpers) => {
    // If not cancelled and times are provided, validate start < end
    if (!value.is_cancelled && value.start_time && value.end_time) {
        const start = new Date(`2000-01-01T${value.start_time}:00`);
        const end = new Date(`2000-01-01T${value.end_time}:00`);
        if (start >= end) {
            return helpers.error('any.invalid', { message: 'Start time must be before end time' });
        }
    }
    return value;
});
//# sourceMappingURL=slotValidation.js.map