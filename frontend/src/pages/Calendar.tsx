import React from 'react';
import WeeklyCalendar from '../components/WeeklyCalendar';

const Calendar: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">Calendar View</h1>
        <p className="mt-2 text-dark-400">
          Weekly calendar with infinite scroll and slot management
        </p>
      </div>

      {/* Weekly Calendar */}
      <WeeklyCalendar />
    </div>
  );
};

export default Calendar;







