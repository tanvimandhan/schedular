import { Router } from 'express';
import { ExceptionController } from '../controllers/exceptionController';
import { validate } from '../middleware/validation';
import { createExceptionSchema, updateExceptionSchema } from '../validation/slotValidation';
import Joi from 'joi';

const router = Router();

// Validation schemas for params
const idParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const slotDateParamSchema = Joi.object({
  slotId: Joi.string().uuid().required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});

// Exception routes
router.post('/', validate(createExceptionSchema), ExceptionController.createException);
router.get('/', ExceptionController.getExceptions);
// Specific routes MUST come before generic /:id routes
router.get('/effective/:slotId/:date', validate(slotDateParamSchema, 'params'), ExceptionController.getEffectiveSlotForDate);
router.get('/:id', validate(idParamSchema, 'params'), ExceptionController.getExceptionById);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateExceptionSchema), ExceptionController.updateException);
router.delete('/:id', validate(idParamSchema, 'params'), ExceptionController.deleteException);

export default router;







