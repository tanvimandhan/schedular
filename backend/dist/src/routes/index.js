"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slotRoutes_1 = __importDefault(require("./slotRoutes"));
const exceptionRoutes_1 = __importDefault(require("./exceptionRoutes"));
const router = (0, express_1.Router)();
// API routes
router.use('/slots', slotRoutes_1.default);
router.use('/exceptions', exceptionRoutes_1.default);
// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Scheduler API is running',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map