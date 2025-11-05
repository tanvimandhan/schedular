"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotController = void 0;
const SlotModel_1 = require("../models/SlotModel");
const SlotExceptionModel_1 = require("../models/SlotExceptionModel");
class SlotController {
    static async createSlot(req, res) {
        try {
            const slotData = req.body;
            // Check if day already has 2 slots
            const slotsCount = await SlotModel_1.SlotModel.getSlotsCountForDay(slotData.day_of_week);
            if (slotsCount >= 2) {
                const response = {
                    success: false,
                    error: 'Limit exceeded',
                    message: 'Maximum 2 slots allowed per day'
                };
                res.status(409).json(response);
                return;
            }
            // Check for time conflicts
            const hasConflict = await SlotModel_1.SlotModel.checkSlotConflict(slotData.day_of_week, slotData.start_time, slotData.end_time);
            if (hasConflict) {
                const response = {
                    success: false,
                    error: 'Conflict',
                    message: 'A slot already exists for this day and time'
                };
                res.status(409).json(response);
                return;
            }
            const slot = await SlotModel_1.SlotModel.create(slotData);
            const response = {
                success: true,
                data: slot,
                message: 'Slot created successfully'
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Error creating slot:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to create slot'
            };
            res.status(500).json(response);
        }
    }
    static async getSlots(req, res) {
        try {
            const slots = await SlotModel_1.SlotModel.findAll();
            const response = {
                success: true,
                data: slots,
                message: 'Slots retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching slots:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch slots'
            };
            res.status(500).json(response);
        }
    }
    static async getWeeklySchedule(req, res) {
        try {
            const schedule = await SlotModel_1.SlotModel.getWeeklySchedule();
            const response = {
                success: true,
                data: schedule,
                message: 'Weekly schedule retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching weekly schedule:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch weekly schedule'
            };
            res.status(500).json(response);
        }
    }
    static async getSlotsByDay(req, res) {
        try {
            const { dayOfWeek } = req.params;
            const day = parseInt(dayOfWeek);
            if (isNaN(day) || day < 0 || day > 6) {
                const response = {
                    success: false,
                    error: 'Invalid day',
                    message: 'Day of week must be between 0 (Sunday) and 6 (Saturday)'
                };
                res.status(400).json(response);
                return;
            }
            const slots = await SlotModel_1.SlotModel.findByDayOfWeek(day);
            const response = {
                success: true,
                data: slots,
                message: `Slots for day ${day} retrieved successfully`
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching slots by day:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch slots for day'
            };
            res.status(500).json(response);
        }
    }
    static async getSlotById(req, res) {
        try {
            const { id } = req.params;
            const slot = await SlotModel_1.SlotModel.findById(id);
            if (!slot) {
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
                data: slot,
                message: 'Slot retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching slot:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch slot'
            };
            res.status(500).json(response);
        }
    }
    static async updateSlot(req, res) {
        try {
            const { id } = req.params;
            const { date, ...updates } = req.body;
            // Check if slot exists
            const existingSlot = await SlotModel_1.SlotModel.findById(id);
            if (!existingSlot) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Slot not found'
                };
                res.status(404).json(response);
                return;
            }
            // If date is provided, create an exception for that specific date
            if (date) {
                // Create exception for this specific date
                const exceptionData = {
                    slot_id: id,
                    exception_date: date,
                    start_time: updates.start_time || existingSlot.start_time,
                    end_time: updates.end_time || existingSlot.end_time,
                    is_cancelled: false,
                    reason: 'Slot updated for specific date'
                };
                // Check if exception already exists
                const existingException = await SlotExceptionModel_1.SlotExceptionModel.findBySlotAndDate(id, date);
                if (existingException) {
                    // Update existing exception
                    const updatedException = await SlotExceptionModel_1.SlotExceptionModel.update(existingException.id, {
                        start_time: exceptionData.start_time,
                        end_time: exceptionData.end_time,
                        is_cancelled: false,
                        reason: exceptionData.reason
                    });
                    const response = {
                        success: true,
                        data: updatedException,
                        message: 'Slot exception updated successfully'
                    };
                    res.json(response);
                }
                else {
                    // Create new exception
                    const exception = await SlotExceptionModel_1.SlotExceptionModel.create(exceptionData);
                    const response = {
                        success: true,
                        data: exception,
                        message: 'Slot exception created successfully'
                    };
                    res.status(201).json(response);
                }
                return;
            }
            // No date provided - update the recurring slot itself
            // Check for conflicts if updating time or day
            if (updates.day_of_week || updates.start_time || updates.end_time) {
                const dayOfWeek = updates.day_of_week ?? existingSlot.day_of_week;
                const startTime = updates.start_time ?? existingSlot.start_time;
                const endTime = updates.end_time ?? existingSlot.end_time;
                const hasConflict = await SlotModel_1.SlotModel.checkSlotConflict(dayOfWeek, startTime, endTime, id);
                if (hasConflict) {
                    const response = {
                        success: false,
                        error: 'Conflict',
                        message: 'A slot already exists for this day and time'
                    };
                    res.status(409).json(response);
                    return;
                }
            }
            const updatedSlot = await SlotModel_1.SlotModel.update(id, updates);
            const response = {
                success: true,
                data: updatedSlot,
                message: 'Slot updated successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error updating slot:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to update slot'
            };
            res.status(500).json(response);
        }
    }
    static async deleteSlot(req, res) {
        try {
            const { id } = req.params;
            const { permanent, date } = req.query;
            // Check if slot exists
            const existingSlot = await SlotModel_1.SlotModel.findById(id);
            if (!existingSlot) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Slot not found'
                };
                res.status(404).json(response);
                return;
            }
            // If date is provided, create an exception (cancel) for that specific date
            if (date && typeof date === 'string') {
                // Check if exception already exists
                const existingException = await SlotExceptionModel_1.SlotExceptionModel.findBySlotAndDate(id, date);
                if (existingException) {
                    // Update existing exception to cancelled
                    const updatedException = await SlotExceptionModel_1.SlotExceptionModel.update(existingException.id, {
                        is_cancelled: true,
                        reason: 'Slot cancelled for specific date'
                    });
                    const response = {
                        success: true,
                        data: updatedException,
                        message: 'Slot cancelled for this date'
                    };
                    res.json(response);
                }
                else {
                    // Create new exception with cancelled status
                    const exception = await SlotExceptionModel_1.SlotExceptionModel.create({
                        slot_id: id,
                        exception_date: date,
                        is_cancelled: true,
                        reason: 'Slot cancelled for specific date'
                    });
                    const response = {
                        success: true,
                        data: exception,
                        message: 'Slot cancelled for this date'
                    };
                    res.status(201).json(response);
                }
                return;
            }
            // No date provided - delete the recurring slot itself
            const deleted = permanent === 'true'
                ? await SlotModel_1.SlotModel.delete(id)
                : await SlotModel_1.SlotModel.softDelete(id);
            if (!deleted) {
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
                message: permanent === 'true' ? 'Slot permanently deleted' : 'Slot deactivated'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error deleting slot:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to delete slot'
            };
            res.status(500).json(response);
        }
    }
    static async getSlotsForDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                const response = {
                    success: false,
                    error: 'Missing parameters',
                    message: 'startDate and endDate are required'
                };
                res.status(400).json(response);
                return;
            }
            const slots = await SlotModel_1.SlotModel.getSlotsForDateRange(startDate, endDate);
            const response = {
                success: true,
                data: slots,
                message: 'Slots for date range retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching slots for date range:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch slots for date range'
            };
            res.status(500).json(response);
        }
    }
    static async getWeeklySlotsWithExceptions(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                const response = {
                    success: false,
                    error: 'Missing parameters',
                    message: 'startDate and endDate are required'
                };
                res.status(400).json(response);
                return;
            }
            const weeklyData = await SlotModel_1.SlotModel.getWeeklySlotsWithExceptions(startDate, endDate);
            const response = {
                success: true,
                data: weeklyData,
                message: 'Weekly slots with exceptions retrieved successfully'
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching weekly slots with exceptions:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch weekly slots with exceptions'
            };
            res.status(500).json(response);
        }
    }
    static async updateSlotWithException(req, res) {
        try {
            const { id } = req.params;
            const { date, updates } = req.body;
            if (!date) {
                const response = {
                    success: false,
                    error: 'Missing parameters',
                    message: 'Date is required for slot updates'
                };
                res.status(400).json(response);
                return;
            }
            // Check if slot exists
            const existingSlot = await SlotModel_1.SlotModel.findById(id);
            if (!existingSlot) {
                const response = {
                    success: false,
                    error: 'Not found',
                    message: 'Slot not found'
                };
                res.status(404).json(response);
                return;
            }
            // Create exception for this specific date
            const exceptionData = {
                slot_id: id,
                exception_date: date,
                start_time: updates.start_time,
                end_time: updates.end_time,
                is_cancelled: updates.is_cancelled || false,
                reason: updates.reason || 'Slot modified'
            };
            const exception = await SlotExceptionModel_1.SlotExceptionModel.create(exceptionData);
            const response = {
                success: true,
                data: exception,
                message: 'Slot exception created successfully'
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Error creating slot exception:', error);
            const response = {
                success: false,
                error: 'Internal server error',
                message: 'Failed to create slot exception'
            };
            res.status(500).json(response);
        }
    }
}
exports.SlotController = SlotController;
//# sourceMappingURL=slotController.js.map