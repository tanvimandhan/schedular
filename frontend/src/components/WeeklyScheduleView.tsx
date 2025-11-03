import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { WeeklySchedule, Slot } from '../types';
import { formatTime, getDayName, getTimeSlotDuration } from '../utils/helpers';

interface WeeklyScheduleViewProps {
  schedule: WeeklySchedule;
}

const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({ schedule }) => {
  const days = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {days.map((dayOfWeek) => {
        const daySlots = schedule[dayOfWeek] || [];
        const dayName = getDayName(dayOfWeek);
        
        return (
          <div key={dayOfWeek} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                {dayName}
              </h3>
              <span className="text-sm text-gray-500">
                {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {daySlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No slots scheduled for {dayName}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{slot.title}</h4>
                        {slot.description && (
                          <p className="text-sm text-gray-600 mt-1">{slot.description}</p>
                        )}
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{getTimeSlotDuration(slot.start_time, slot.end_time)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {slot.is_recurring && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Recurring
                          </span>
                        )}
                        {!slot.is_active && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyScheduleView;







