export interface Slot {
  id: string;
  title: string;
  description?: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  effective_from: string;
  effective_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SlotException {
  id: string;
  slot_id: string;
  exception_date: string;
  start_time?: string;
  end_time?: string;
  is_cancelled: boolean;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSlotRequest {
  title: string;
  description?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
  effective_from: string;
  effective_until?: string;
}

export interface UpdateSlotRequest {
  title?: string;
  description?: string;
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  is_recurring?: boolean;
  effective_from?: string;
  effective_until?: string;
  is_active?: boolean;
}

export interface CreateExceptionRequest {
  slot_id: string;
  exception_date: string;
  start_time?: string;
  end_time?: string;
  is_cancelled?: boolean;
  reason?: string;
}

export interface UpdateExceptionRequest {
  start_time?: string;
  end_time?: string;
  is_cancelled?: boolean;
  reason?: string;
}

export interface WeeklySchedule {
  [dayOfWeek: number]: Slot[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}







