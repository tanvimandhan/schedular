import axios from 'axios';
import { ApiResponse, Slot, SlotException, CreateSlotRequest, UpdateSlotRequest, CreateExceptionRequest, UpdateExceptionRequest, WeeklySchedule } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Slot API functions
export const slotApi = {
  // Get all slots
  getAllSlots: async (): Promise<Slot[]> => {
    const response = await api.get<ApiResponse<Slot[]>>('/slots');
    return response.data.data || [];
  },

  // Get weekly schedule
  getWeeklySchedule: async (): Promise<WeeklySchedule> => {
    const response = await api.get<ApiResponse<WeeklySchedule>>('/slots/weekly');
    return response.data.data || {};
  },

  // Get slots by day
  getSlotsByDay: async (dayOfWeek: number): Promise<Slot[]> => {
    const response = await api.get<ApiResponse<Slot[]>>(`/slots/day/${dayOfWeek}`);
    return response.data.data || [];
  },

  // Get slot by ID
  getSlotById: async (id: string): Promise<Slot> => {
    const response = await api.get<ApiResponse<Slot>>(`/slots/${id}`);
    if (!response.data.data) {
      throw new Error('Slot not found');
    }
    return response.data.data;
  },

  // Create slot
  createSlot: async (slotData: CreateSlotRequest): Promise<Slot> => {
    const response = await api.post<ApiResponse<Slot>>('/slots', slotData);
    if (!response.data.data) {
      throw new Error('Failed to create slot');
    }
    return response.data.data;
  },

  // Update slot
  updateSlot: async (id: string, updates: UpdateSlotRequest): Promise<Slot> => {
    const response = await api.put<ApiResponse<Slot>>(`/slots/${id}`, updates);
    if (!response.data.data) {
      throw new Error('Failed to update slot');
    }
    return response.data.data;
  },

  // Delete slot
  deleteSlot: async (id: string, permanent = false): Promise<void> => {
    await api.delete(`/slots/${id}?permanent=${permanent}`);
  },

  // Get slots for date range
  getSlotsForDateRange: async (startDate: string, endDate: string): Promise<Slot[]> => {
    const response = await api.get<ApiResponse<Slot[]>>('/slots/date-range', {
      params: { startDate, endDate }
    });
    return response.data.data || [];
  },

  // Get weekly slots with exceptions
  getWeeklySlotsWithExceptions: async (startDate: string, endDate: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>('/slots/weekly-with-exceptions', {
      params: { startDate, endDate }
    });
    return response.data.data || [];
  },

  // Update slot with exception (for specific date)
  updateSlotWithException: async (id: string, date: string, updates: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/slots/${id}/exception`, {
      date,
      updates
    });
    if (!response.data.data) {
      throw new Error('Failed to update slot with exception');
    }
    return response.data.data;
  },
};

// Exception API functions
export const exceptionApi = {
  // Get all exceptions
  getAllExceptions: async (): Promise<SlotException[]> => {
    const response = await api.get<ApiResponse<SlotException[]>>('/exceptions');
    return response.data.data || [];
  },

  // Get exceptions by slot ID
  getExceptionsBySlotId: async (slotId: string): Promise<SlotException[]> => {
    const response = await api.get<ApiResponse<SlotException[]>>('/exceptions', {
      params: { slotId }
    });
    return response.data.data || [];
  },

  // Get exceptions by date range
  getExceptionsByDateRange: async (startDate: string, endDate: string): Promise<SlotException[]> => {
    const response = await api.get<ApiResponse<SlotException[]>>('/exceptions', {
      params: { startDate, endDate }
    });
    return response.data.data || [];
  },

  // Get exception by ID
  getExceptionById: async (id: string): Promise<SlotException> => {
    const response = await api.get<ApiResponse<SlotException>>(`/exceptions/${id}`);
    if (!response.data.data) {
      throw new Error('Exception not found');
    }
    return response.data.data;
  },

  // Create exception
  createException: async (exceptionData: CreateExceptionRequest): Promise<SlotException> => {
    const response = await api.post<ApiResponse<SlotException>>('/exceptions', exceptionData);
    if (!response.data.data) {
      throw new Error('Failed to create exception');
    }
    return response.data.data;
  },

  // Update exception
  updateException: async (id: string, updates: UpdateExceptionRequest): Promise<SlotException> => {
    const response = await api.put<ApiResponse<SlotException>>(`/exceptions/${id}`, updates);
    if (!response.data.data) {
      throw new Error('Failed to update exception');
    }
    return response.data.data;
  },

  // Delete exception
  deleteException: async (id: string): Promise<void> => {
    await api.delete(`/exceptions/${id}`);
  },

  // Get effective slot for date
  getEffectiveSlotForDate: async (slotId: string, date: string): Promise<{ slot: Slot; exception?: SlotException }> => {
    const response = await api.get<ApiResponse<{ slot: Slot; exception?: SlotException }>>(`/exceptions/effective/${slotId}/${date}`);
    if (!response.data.data) {
      throw new Error('Slot not found');
    }
    return response.data.data;
  },
};

export default api;
