import { SlotException, CreateExceptionRequest, UpdateExceptionRequest } from '../types';
export declare class SlotExceptionModel {
    static create(exceptionData: CreateExceptionRequest): Promise<SlotException>;
    static findById(id: string): Promise<SlotException | null>;
    static findAll(): Promise<SlotException[]>;
    static findBySlotId(slotId: string): Promise<SlotException[]>;
    static findByDateRange(startDate: string, endDate: string): Promise<SlotException[]>;
    static findBySlotAndDate(slotId: string, date: string): Promise<SlotException | null>;
    static update(id: string, updates: UpdateExceptionRequest): Promise<SlotException | null>;
    static delete(id: string): Promise<boolean>;
    static getExceptionsForSlotInDateRange(slotId: string, startDate: string, endDate: string): Promise<SlotException[]>;
    static getEffectiveSlotForDate(slotId: string, date: string): Promise<{
        slot: any;
        exception?: SlotException | null;
    } | null>;
}
//# sourceMappingURL=SlotExceptionModel.d.ts.map