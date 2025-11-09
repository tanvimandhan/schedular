"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotExceptionModel = void 0;
const connection_1 = require("../database/connection");
class SlotExceptionModel {
    static async create(exceptionData) {
        const [exception] = await (0, connection_1.db)('slot_exceptions')
            .insert(exceptionData)
            .returning('*');
        return exception;
    }
    static async findById(id) {
        const exception = await (0, connection_1.db)('slot_exceptions').where('id', id).first();
        return exception || null;
    }
    static async findAll() {
        return await (0, connection_1.db)('slot_exceptions').orderBy('exception_date');
    }
    static async findBySlotId(slotId) {
        return await (0, connection_1.db)('slot_exceptions')
            .where('slot_id', slotId)
            .orderBy('exception_date');
    }
    static async findByDateRange(startDate, endDate) {
        return await (0, connection_1.db)('slot_exceptions')
            .whereBetween('exception_date', [startDate, endDate])
            .orderBy('exception_date');
    }
    static async findBySlotAndDate(slotId, date) {
        const exception = await (0, connection_1.db)('slot_exceptions')
            .where('slot_id', slotId)
            .where('exception_date', date)
            .first();
        return exception || null;
    }
    static async update(id, updates) {
        const [updatedException] = await (0, connection_1.db)('slot_exceptions')
            .where('id', id)
            .update({ ...updates, updated_at: new Date() })
            .returning('*');
        return updatedException || null;
    }
    static async delete(id) {
        const deletedCount = await (0, connection_1.db)('slot_exceptions').where('id', id).del();
        return deletedCount > 0;
    }
    static async getExceptionsForSlotInDateRange(slotId, startDate, endDate) {
        return await (0, connection_1.db)('slot_exceptions')
            .where('slot_id', slotId)
            .whereBetween('exception_date', [startDate, endDate])
            .orderBy('exception_date');
    }
    static async getEffectiveSlotForDate(slotId, date) {
        // Get the base slot
        const slot = await (0, connection_1.db)('slots').where('id', slotId).first();
        if (!slot)
            return null;
        // Check if there's an exception for this date
        const exception = await this.findBySlotAndDate(slotId, date);
        return { slot, exception };
    }
}
exports.SlotExceptionModel = SlotExceptionModel;
//# sourceMappingURL=SlotExceptionModel.js.map