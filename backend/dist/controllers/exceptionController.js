"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionController = void 0;
const SlotExceptionModel_1 = require("../models/SlotExceptionModel");
const SlotModel_1 = require("../models/SlotModel");
class ExceptionController {
    static async createException(req, res) {
        try {
            const exceptionData = req.body;
            // Verify slot exists
            const slot = await SlotModel_1.SlotModel.findById(exceptionData.slot_id);
            if (!slot) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Slot not found'
                };
                res.status(404).json(response);
                return;
            }
            // Check if exception already exists for this date
            const existingException = await SlotExceptionModel_1.SlotExceptionModel.findBySlotAndDate(exceptionData.slot_id, exceptionData.exception_date);
            if (existingException) {
                const response = {
                    success: false,
                    error: 'Conflict',
                    message: 'Exception already exists for this slot and date'
                };
                res.status(409).json(response);
                return;
            }
            // If not cancelled and times are provided, check for conflicts
            if (!exceptionData.is_cancelled && exceptionData.start_time && exceptionData.end_time) {
                const dayOfWeek = new Date(exceptionData.exception_date).getDay();
                const hasConflict = await SlotModel_1.SlotModel.checkSlotConflict(dayOfWeek, exceptionData.start_time, exceptionData.end_time, exceptionData.slot_id);
                if (hasConflict) {
                    const response = {
                        success: false,
                        error: 'Conflict',
                        message: 'Time conflict with existing slot'
                    };
                    res.status(409).json(response);
                    return;
                }
            }
            const exception = await SlotExceptionModel_1.SlotExceptionModel.create(exceptionData);
            const response = {
                success: true,
                data: exception,
                message: 'Exception created successfully'
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Error creating exception:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to create exception'
            };
            res.status(500).json(response);
        }
    }
    static async getExceptions(req, res) {
        try {
            const { slotId, startDate, endDate } = req.query;
            let exceptions;
            if (slotId) {
                exceptions = await SlotExceptionModel_1.SlotExceptionModel.findBySlotId(slotId);
            }
            else if (startDate && endDate) {
                exceptions = await SlotExceptionModel_1.SlotExceptionModel.findByDateRange(startDate, endDate);
            }
            else {
                // No parameters provided - return all exceptions
                exceptions = await SlotExceptionModel_1.SlotExceptionModel.findAll();
            }
            const response = {
                success: true,
                data: exceptions,
                message: 'Exceptions retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching exceptions:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch exceptions'
            };
            res.status(500).json(response);
        }
    }
    static async getExceptionById(req, res) {
        try {
            const { id } = req.params;
            const exception = await SlotExceptionModel_1.SlotExceptionModel.findById(id);
            if (!exception) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Exception not found'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: exception,
                message: 'Exception retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching exception:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch exception'
            };
            res.status(500).json(response);
        }
    }
    static async updateException(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            // Check if exception exists
            const existingException = await SlotExceptionModel_1.SlotExceptionModel.findById(id);
            if (!existingException) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Exception not found'
                };
                res.status(404).json(response);
                return;
            }
            // If updating times and not cancelled, check for conflicts
            if (!updates.is_cancelled && (updates.start_time || updates.end_time)) {
                const startTime = updates.start_time ?? existingException.start_time;
                const endTime = updates.end_time ?? existingException.end_time;
                if (startTime && endTime) {
                    const dayOfWeek = new Date(existingException.exception_date).getDay();
                    const hasConflict = await SlotModel_1.SlotModel.checkSlotConflict(dayOfWeek, startTime, endTime, existingException.slot_id);
                    if (hasConflict) {
                        const response = {
                            success: false,
                            error: 'Conflict',
                            message: 'Time conflict with existing slot'
                        };
                        res.status(409).json(response);
                        return;
                    }
                }
            }
            const updatedException = await SlotExceptionModel_1.SlotExceptionModel.update(id, updates);
            const response = {
                success: true,
                data: updatedException,
                message: 'Exception updated successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error updating exception:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to update exception'
            };
            res.status(500).json(response);
        }
    }
    static async deleteException(req, res) {
        try {
            const { id } = req.params;
            const deleted = await SlotExceptionModel_1.SlotExceptionModel.delete(id);
            if (!deleted) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Exception not found'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Exception deleted successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error deleting exception:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to delete exception'
            };
            res.status(500).json(response);
        }
    }
    static async getEffectiveSlotForDate(req, res) {
        try {
            const { slotId, date } = req.params;
            const effectiveSlot = await SlotExceptionModel_1.SlotExceptionModel.getEffectiveSlotForDate(slotId, date);
            if (!effectiveSlot) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Slot not found'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: effectiveSlot,
                message: 'Effective slot retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching effective slot:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch effective slot'
            };
            res.status(500).json(response);
        }
    }
}
exports.ExceptionController = ExceptionController;
//# sourceMappingURL=exceptionController.js.map