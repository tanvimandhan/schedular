import { Router } from 'express';
import { SlotController } from '../controllers/slotController';
import { validate } from '../middleware/validation';
import { createSlotSchema, updateSlotSchema } from '../validation/slotValidation';
import Joi from 'joi';

const router = Router();

// Validation schemas for params
const idParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const dayParamSchema = Joi.object({
  dayOfWeek: Joi.string().pattern(/^[0-6]$/).required()
});

// Slot routes
router.post('/', validate(createSlotSchema), SlotController.createSlot);
router.get('/', SlotController.getSlots);
router.get('/weekly', SlotController.getWeeklySchedule);
router.get('/weekly-with-exceptions', SlotController.getWeeklySlotsWithExceptions);
router.get('/day/:dayOfWeek', validate(dayParamSchema, 'params'), SlotController.getSlotsByDay);
router.get('/date-range', SlotController.getSlotsForDateRange);
router.get('/:id', validate(idParamSchema, 'params'), SlotController.getSlotById);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateSlotSchema), SlotController.updateSlot);
router.put('/:id/exception', validate(idParamSchema, 'params'), SlotController.updateSlotWithException);
router.delete('/:id', validate(idParamSchema, 'params'), SlotController.deleteSlot);

export default router;
