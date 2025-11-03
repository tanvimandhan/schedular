import { db } from '../database/connection';
import { Slot, CreateSlotRequest, UpdateSlotRequest, WeeklySchedule } from '../types';

export class SlotModel {
  static async create(slotData: CreateSlotRequest): Promise<Slot> {
    const [slot] = await db('slots')
      .insert(slotData)
      .returning('*');
    return slot;
  }

  static async findById(id: string): Promise<Slot | null> {
    const slot = await db('slots').where('id', id).first();
    return slot || null;
  }

  static async findAll(): Promise<Slot[]> {
    return await db('slots').orderBy('day_of_week').orderBy('start_time');
  }

  static async findByDayOfWeek(dayOfWeek: number): Promise<Slot[]> {
    return await db('slots')
      .where('day_of_week', dayOfWeek)
      .where('is_active', true)
      .orderBy('start_time');
  }

  static async getWeeklySchedule(): Promise<WeeklySchedule> {
    const slots = await this.findAll();
    const weeklySchedule: WeeklySchedule = {};
    
    for (let i = 0; i < 7; i++) {
      weeklySchedule[i] = slots.filter(slot => slot.day_of_week === i && slot.is_active);
    }
    
    return weeklySchedule;
  }

  static async update(id: string, updates: UpdateSlotRequest): Promise<Slot | null> {
    const [updatedSlot] = await db('slots')
      .where('id', id)
      .update({ ...updates, updated_at: new Date() })
      .returning('*');
    
    return updatedSlot || null;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedCount = await db('slots').where('id', id).del();
    return deletedCount > 0;
  }

  static async softDelete(id: string): Promise<boolean> {
    const updatedCount = await db('slots')
      .where('id', id)
      .update({ is_active: false, updated_at: new Date() });
    
    return updatedCount > 0;
  }

  static async getSlotsForDateRange(startDate: string, endDate: string): Promise<Slot[]> {
    return await db('slots')
      .where('is_active', true)
      .where(function() {
        this.where('effective_until', '>=', startDate)
            .orWhereNull('effective_until');
      })
      .where('effective_from', '<=', endDate);
  }

  static async checkSlotConflict(
    dayOfWeek: number, 
    startTime: string, 
    endTime: string, 
    excludeId?: string
  ): Promise<boolean> {
    const query = db('slots')
      .where('day_of_week', dayOfWeek)
      .where('is_active', true)
      .where(function() {
        this.whereBetween('start_time', [startTime, endTime])
            .orWhereBetween('end_time', [startTime, endTime])
            .orWhere(function() {
              this.where('start_time', '<=', startTime)
                  .where('end_time', '>=', endTime);
            });
      });

    if (excludeId) {
      query.where('id', '!=', excludeId);
    }

    const conflictingSlots = await query;
    return conflictingSlots.length > 0;
  }

  static async getSlotsCountForDay(dayOfWeek: number): Promise<number> {
    const result = await db('slots')
      .where('day_of_week', dayOfWeek)
      .where('is_active', true)
      .count('* as count')
      .first();
    
    return parseInt(result?.count as string) || 0;
  }

  static async getWeeklySlotsWithExceptions(startDate: string, endDate: string): Promise<any[]> {
    // Get all active slots
    const slots = await db('slots')
      .where('is_active', true)
      .where(function() {
        this.where('effective_until', '>=', startDate)
            .orWhereNull('effective_until');
      })
      .where('effective_from', '<=', endDate);

    // Get exceptions for the date range
    const exceptions = await db('slot_exceptions')
      .whereBetween('exception_date', [startDate, endDate])
      .join('slots', 'slot_exceptions.slot_id', 'slots.id');

    // Generate dates for the week
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      
      // Find slots for this day
      const daySlots = slots.filter(slot => slot.day_of_week === dayOfWeek);
      
      // Find exceptions for this date
      const dayExceptions = exceptions.filter(ex => ex.exception_date === dateStr);
      
      // Process each slot for this day
      const processedSlots = daySlots.map(slot => {
        const exception = dayExceptions.find(ex => ex.slot_id === slot.id);
        
        if (exception) {
          return {
            ...slot,
            exception_id: exception.id,
            is_cancelled: exception.is_cancelled,
            modified_start_time: exception.start_time,
            modified_end_time: exception.end_time,
            exception_reason: exception.reason,
            is_exception: true
          };
        }
        
        return {
          ...slot,
          is_exception: false
        };
      });

      dates.push({
        date: dateStr,
        day_of_week: dayOfWeek,
        slots: processedSlots
      });
    }

    return dates;
  }
}
