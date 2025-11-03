import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock } from 'lucide-react';
import { slotApi } from '../services/api';
import { formatTime, formatDate, getDayName, getTimeSlotDuration } from '../utils/helpers';
import { addWeeks, startOfWeek, endOfWeek, format, addDays, isToday } from 'date-fns';
import CreateSlotModal from './CreateSlotModal';
import EditSlotModal from './EditSlotModal';
import toast from 'react-hot-toast';

interface WeeklyCalendarProps {
  onSlotCreate?: () => void;
  onSlotUpdate?: () => void;
  onSlotDelete?: () => void;
}

interface DayData {
  date: string;
  day_of_week: number;
  slots: any[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  onSlotCreate,
  onSlotUpdate,
  onSlotDelete
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weeks, setWeeks] = useState<DayData[][]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadWeek = useCallback(async (weekStart: Date) => {
    const startDate = format(startOfWeek(weekStart, { weekStartsOn: 0 }), 'yyyy-MM-dd');
    const endDate = format(endOfWeek(weekStart, { weekStartsOn: 0 }), 'yyyy-MM-dd');
    
    try {
      const weekData = await slotApi.getWeeklySlotsWithExceptions(startDate, endDate);
      return weekData;
    } catch (error) {
      console.error('Error loading week:', error);
      toast.error('Failed to load week data');
      return [];
    }
  }, []);

  const loadInitialWeeks = useCallback(async () => {
    setLoading(true);
    try {
      const currentWeekData = await loadWeek(currentWeek);
      const nextWeekData = await loadWeek(addWeeks(currentWeek, 1));
      const prevWeekData = await loadWeek(addWeeks(currentWeek, -1));
      
      setWeeks([prevWeekData, currentWeekData, nextWeekData]);
    } catch (error) {
      console.error('Error loading initial weeks:', error);
    } finally {
      setLoading(false);
    }
  }, [currentWeek, loadWeek]);

  const loadMoreWeeks = useCallback(async (direction: 'prev' | 'next') => {
    setLoadingMore(true);
    try {
      const newWeek = direction === 'next' 
        ? addWeeks(currentWeek, weeks.length)
        : addWeeks(currentWeek, -weeks.length);
      
      const newWeekData = await loadWeek(newWeek);
      
      if (direction === 'next') {
        setWeeks(prev => [...prev, newWeekData]);
      } else {
        setWeeks(prev => [newWeekData, ...prev]);
      }
    } catch (error) {
      console.error('Error loading more weeks:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentWeek, weeks.length, loadWeek]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 200;

    // Load more weeks when scrolling near the bottom
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMoreWeeks('next');
    }
    
    // Load more weeks when scrolling near the top
    if (scrollTop <= threshold) {
      loadMoreWeeks('prev');
    }
  }, [loadMoreWeeks, loadingMore]);

  useEffect(() => {
    loadInitialWeeks();
  }, [loadInitialWeeks]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = direction === 'next' 
      ? addWeeks(currentWeek, 1)
      : addWeeks(currentWeek, -1);
    setCurrentWeek(newWeek);
  };

  const handleSlotEdit = (slot: any, date: string) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
    setShowEditModal(true);
  };

  const handleSlotDelete = async (slot: any, date: string) => {
    if (!window.confirm('Are you sure you want to delete this slot for this date?')) {
      return;
    }

    // Optimistic update: immediately mark as cancelled in UI
    const originalWeeks = JSON.parse(JSON.stringify(weeks)); // Deep copy
    setWeeks(prevWeeks => 
      prevWeeks.map(week => 
        week.map(day => {
          if (day.date === date) {
            return {
              ...day,
              slots: day.slots.map(s => 
                s.id === slot.id 
                  ? { ...s, is_cancelled: true, is_exception: true }
                  : s
              )
            };
          }
          return day;
        })
      )
    );

    try {
      await slotApi.updateSlotWithException(slot.id, date, { is_cancelled: true });
      toast.success('Slot cancelled for this date');
      // Optionally refresh to sync with server
      setTimeout(() => loadInitialWeeks(), 500);
      onSlotDelete?.();
    } catch (error) {
      // Revert on error
      setWeeks(originalWeeks);
      toast.error('Failed to cancel slot');
      console.error('Delete slot error:', error);
    }
  };

  const handleSlotCreate = () => {
    setShowCreateModal(true);
  };

  const handleSlotCreateSuccess = async (newSlot: any) => {
    setShowCreateModal(false);
    
    // Optimistic update: immediately add slot to UI
    if (newSlot) {
      const slotDate = newSlot.effective_from || new Date().toISOString().split('T')[0];
      const dayOfWeek = newSlot.day_of_week;
      
      setWeeks(prevWeeks => 
        prevWeeks.map(week => 
          week.map(day => {
            // Check if this day matches the slot's day of week
            if (day.day_of_week === dayOfWeek) {
              return {
                ...day,
                slots: [...day.slots, {
                  ...newSlot,
                  is_exception: false,
                  is_cancelled: false
                }]
              };
            }
            return day;
          })
        )
      );
      
      toast.success('Slot created successfully');
    }
    
    // Refresh to sync with server
    setTimeout(() => loadInitialWeeks(), 500);
    onSlotCreate?.();
  };

  const handleSlotEditSuccess = async (updatedException: any) => {
    setShowEditModal(false);
    const slotToUpdate = selectedSlot;
    const dateToUpdate = selectedDate;
    setSelectedSlot(null);
    setSelectedDate('');
    
    // Optimistic update: immediately update slot in UI
    if (updatedException && slotToUpdate && dateToUpdate) {
      setWeeks(prevWeeks => 
        prevWeeks.map(week => 
          week.map(day => {
            if (day.date === dateToUpdate) {
              return {
                ...day,
                slots: day.slots.map(s => 
                  s.id === slotToUpdate.id
                    ? {
                        ...s,
                        is_exception: true,
                        is_cancelled: updatedException.is_cancelled || false,
                        modified_start_time: updatedException.start_time || s.start_time,
                        modified_end_time: updatedException.end_time || s.end_time,
                        exception_reason: updatedException.reason
                      }
                    : s
                )
              };
            }
            return day;
          })
        )
      );
      
      toast.success('Slot updated successfully');
    }
    
    // Refresh to sync with server
    setTimeout(() => loadInitialWeeks(), 500);
    onSlotUpdate?.();
  };

  const getSlotDisplayTime = (slot: any) => {
    if (slot.is_exception && slot.modified_start_time && slot.modified_end_time) {
      return `${formatTime(slot.modified_start_time)} - ${formatTime(slot.modified_end_time)}`;
    }
    return `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`;
  };

  const getSlotDisplayTitle = (slot: any) => {
    if (slot.is_exception && slot.is_cancelled) {
      return `${slot.title} (Cancelled)`;
    }
    if (slot.is_exception) {
      return `${slot.title} (Modified)`;
    }
    return slot.title;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentWeek, 'MMM dd, yyyy')} - {format(addDays(currentWeek, 6), 'MMM dd, yyyy')}
          </h2>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleSlotCreate}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Slot
        </button>
      </div>

      {/* Calendar */}
      <div 
        ref={scrollContainerRef}
        className="h-96 overflow-y-auto border border-gray-200 rounded-lg"
      >
        <div className="space-y-4 p-4">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="space-y-2">
              {weekIndex === 0 && (
                <div className="text-sm text-gray-500 text-center">
                  {loadingMore ? 'Loading previous weeks...' : ''}
                </div>
              )}
              
              <div className="grid grid-cols-7 gap-2">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`border rounded-lg p-3 min-h-32 ${
                      isToday(new Date(day.date))
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getDayName(day.day_of_week)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(day.date), 'MMM dd')}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {day.slots.length}/2
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {day.slots.map((slot, slotIndex) => (
                        <div
                          key={`${slot.id}-${day.date}`}
                          className={`p-2 rounded text-xs ${
                            slot.is_exception && slot.is_cancelled
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : slot.is_exception
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          <div className="font-medium truncate">
                            {getSlotDisplayTitle(slot)}
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {getSlotDisplayTime(slot)}
                          </div>
                          <div className="flex items-center justify-end mt-1 space-x-1">
                            <button
                              onClick={() => handleSlotEdit(slot, day.date)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded"
                              title="Edit"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleSlotDelete(slot, day.date)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {day.slots.length < 2 && (
                        <button
                          onClick={() => {
                            setSelectedDate(day.date);
                            handleSlotCreate();
                          }}
                          className="w-full p-2 text-xs text-gray-400 hover:text-gray-600 border-2 border-dashed border-gray-300 rounded hover:border-gray-400"
                        >
                          <Plus className="h-3 w-3 mx-auto mb-1" />
                          Add Slot
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {weekIndex === weeks.length - 1 && (
                <div className="text-sm text-gray-500 text-center">
                  {loadingMore ? 'Loading more weeks...' : 'Scroll for more weeks'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSlotModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSlotCreateSuccess}
          defaultDate={selectedDate}
        />
      )}

      {showEditModal && selectedSlot && (
        <EditSlotModal
          slot={selectedSlot}
          date={selectedDate}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSlot(null);
            setSelectedDate('');
          }}
          onSuccess={handleSlotEditSuccess}
        />
      )}
    </div>
  );
};

export default WeeklyCalendar;
