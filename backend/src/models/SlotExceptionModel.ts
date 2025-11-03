import { db } from '../database/connection';
import { SlotException, CreateExceptionRequest, UpdateExceptionRequest } from '../types';

export class SlotExceptionModel {
  static async create(exceptionData: CreateExceptionRequest): Promise<SlotException> {
    const [exception] = await db('slot_exceptions')
      .insert(exceptionData)
      .returning('*');
    return exception;
  }

  static async findById(id: string): Promise<SlotException | null> {
    const exception = await db('slot_exceptions').where('id', id).first();
    return exception || null;
  }

  static async findAll(): Promise<SlotException[]> {
    return await db('slot_exceptions').orderBy('exception_date');
  }

  static async findBySlotId(slotId: string): Promise<SlotException[]> {
    return await db('slot_exceptions')
      .where('slot_id', slotId)
      .orderBy('exception_date');
  }

  static async findByDateRange(startDate: string, endDate: string): Promise<SlotException[]> {
    return await db('slot_exceptions')
      .whereBetween('exception_date', [startDate, endDate])
      .orderBy('exception_date');
  }

  static async findBySlotAndDate(slotId: string, date: string): Promise<SlotException | null> {
    const exception = await db('slot_exceptions')
      .where('slot_id', slotId)
      .where('exception_date', date)
      .first();
    return exception || null;
  }

  static async update(id: string, updates: UpdateExceptionRequest): Promise<SlotException | null> {
    const [updatedException] = await db('slot_exceptions')
      .where('id', id)
      .update({ ...updates, updated_at: new Date() })
      .returning('*');
    
    return updatedException || null;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedCount = await db('slot_exceptions').where('id', id).del();
    return deletedCount > 0;
  }

  static async getExceptionsForSlotInDateRange(
    slotId: string, 
    startDate: string, 
    endDate: string
  ): Promise<SlotException[]> {
    return await db('slot_exceptions')
      .where('slot_id', slotId)
      .whereBetween('exception_date', [startDate, endDate])
      .orderBy('exception_date');
  }

  static async getEffectiveSlotForDate(slotId: string, date: string): Promise<{
    slot: any;
    exception?: SlotException | null;
  } | null> {
    // Get the base slot
    const slot = await db('slots').where('id', slotId).first();
    if (!slot) return null;

    // Check if there's an exception for this date
    const exception = await this.findBySlotAndDate(slotId, date);
    
    return { slot, exception };
  }
}







