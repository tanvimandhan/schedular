import { Slot, CreateSlotRequest, UpdateSlotRequest, WeeklySchedule } from '../types';
export declare class SlotModel {
    static create(slotData: CreateSlotRequest): Promise<Slot>;
    static findById(id: string): Promise<Slot | null>;
    static findAll(): Promise<Slot[]>;
    static findByDayOfWeek(dayOfWeek: number): Promise<Slot[]>;
    static getWeeklySchedule(): Promise<WeeklySchedule>;
    static update(id: string, updates: UpdateSlotRequest): Promise<Slot | null>;
    static delete(id: string): Promise<boolean>;
    static softDelete(id: string): Promise<boolean>;
    static getSlotsForDateRange(startDate: string, endDate: string): Promise<Slot[]>;
    static checkSlotConflict(dayOfWeek: number, startTime: string, endTime: string, excludeId?: string): Promise<boolean>;
    static getSlotsCountForDay(dayOfWeek: number): Promise<number>;
    static getWeeklySlotsWithExceptions(startDate: string, endDate: string): Promise<any[]>;
}
//# sourceMappingURL=SlotModel.d.ts.map