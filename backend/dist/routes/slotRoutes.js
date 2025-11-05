"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slotController_1 = require("../controllers/slotController");
const validation_1 = require("../middleware/validation");
const slotValidation_1 = require("../validation/slotValidation");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
// Validation schemas for params
const idParamSchema = joi_1.default.object({
    id: joi_1.default.string().uuid().required()
});
const dayParamSchema = joi_1.default.object({
    dayOfWeek: joi_1.default.string().pattern(/^[0-6]$/).required()
});
// Slot routes
router.post('/', (0, validation_1.validate)(slotValidation_1.createSlotSchema), slotController_1.SlotController.createSlot);
router.get('/', slotController_1.SlotController.getSlots);
router.get('/weekly', slotController_1.SlotController.getWeeklySchedule);
router.get('/weekly-with-exceptions', slotController_1.SlotController.getWeeklySlotsWithExceptions);
router.get('/day/:dayOfWeek', (0, validation_1.validate)(dayParamSchema, 'params'), slotController_1.SlotController.getSlotsByDay);
router.get('/date-range', slotController_1.SlotController.getSlotsForDateRange);
router.get('/:id', (0, validation_1.validate)(idParamSchema, 'params'), slotController_1.SlotController.getSlotById);
router.put('/:id', (0, validation_1.validate)(idParamSchema, 'params'), (0, validation_1.validate)(slotValidation_1.updateSlotSchema), slotController_1.SlotController.updateSlot);
router.put('/:id/exception', (0, validation_1.validate)(idParamSchema, 'params'), slotController_1.SlotController.updateSlotWithException);
router.delete('/:id', (0, validation_1.validate)(idParamSchema, 'params'), slotController_1.SlotController.deleteSlot);
exports.default = router;
//# sourceMappingURL=slotRoutes.js.map