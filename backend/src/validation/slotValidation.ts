import Joi from 'joi';

export const createSlotSchema = Joi.object({
  title: Joi.string().required().min(1).max(100),
  description: Joi.string().max(500).allow(''),
  day_of_week: Joi.number().integer().min(0).max(6).required(),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  is_recurring: Joi.boolean().default(true),
  effective_from: Joi.date().iso().required(),
  effective_until: Joi.date().iso().greater(Joi.ref('effective_from')).allow(null)
}).custom((value, helpers) => {
  // Validate that start_time is before end_time
  const start = new Date(`2000-01-01T${value.start_time}:00`);
  const end = new Date(`2000-01-01T${value.end_time}:00`);
  
  if (start >= end) {
    return helpers.error('any.invalid', { message: 'Start time must be before end time' });
  }
  
  return value;
});

export const updateSlotSchema = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(), // Optional date for exception creation
  title: Joi.string().min(1).max(100),
  description: Joi.string().max(500).allow(''),
  day_of_week: Joi.number().integer().min(0).max(6),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  is_recurring: Joi.boolean(),
  effective_from: Joi.date().iso(),
  effective_until: Joi.date().iso().allow(null),
  is_active: Joi.boolean()
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

export const createExceptionSchema = Joi.object({
  slot_id: Joi.string().uuid().required(),
  exception_date: Joi.date().iso().required(),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
  is_cancelled: Joi.boolean().default(false),
  reason: Joi.string().max(500).allow('')
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

export const updateExceptionSchema = Joi.object({
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
  is_cancelled: Joi.boolean(),
  reason: Joi.string().max(500).allow('')
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






