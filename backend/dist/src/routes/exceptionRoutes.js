"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exceptionController_1 = require("../controllers/exceptionController");
const validation_1 = require("../middleware/validation");
const slotValidation_1 = require("../validation/slotValidation");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
// Validation schemas for params
const idParamSchema = joi_1.default.object({
    id: joi_1.default.string().uuid().required()
});
const slotDateParamSchema = joi_1.default.object({
    slotId: joi_1.default.string().uuid().required(),
    date: joi_1.default.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});
// Exception routes
router.post('/', (0, validation_1.validate)(slotValidation_1.createExceptionSchema), exceptionController_1.ExceptionController.createException);
router.get('/', exceptionController_1.ExceptionController.getExceptions);
// Specific routes MUST come before generic /:id routes
router.get('/effective/:slotId/:date', (0, validation_1.validate)(slotDateParamSchema, 'params'), exceptionController_1.ExceptionController.getEffectiveSlotForDate);
router.get('/:id', (0, validation_1.validate)(idParamSchema, 'params'), exceptionController_1.ExceptionController.getExceptionById);
router.put('/:id', (0, validation_1.validate)(idParamSchema, 'params'), (0, validation_1.validate)(slotValidation_1.updateExceptionSchema), exceptionController_1.ExceptionController.updateException);
router.delete('/:id', (0, validation_1.validate)(idParamSchema, 'params'), exceptionController_1.ExceptionController.deleteException);
exports.default = router;
//# sourceMappingURL=exceptionRoutes.js.map