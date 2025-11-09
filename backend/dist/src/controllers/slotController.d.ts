import { Request, Response } from 'express';
export declare class SlotController {
    static createSlot(req: Request, res: Response): Promise<void>;
    static getSlots(req: Request, res: Response): Promise<void>;
    static getWeeklySchedule(req: Request, res: Response): Promise<void>;
    static getSlotsByDay(req: Request, res: Response): Promise<void>;
    static getSlotById(req: Request, res: Response): Promise<void>;
    static updateSlot(req: Request, res: Response): Promise<void>;
    static deleteSlot(req: Request, res: Response): Promise<void>;
    static getSlotsForDateRange(req: Request, res: Response): Promise<void>;
    static getWeeklySlotsWithExceptions(req: Request, res: Response): Promise<void>;
    static updateSlotWithException(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=slotController.d.ts.map