import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Plus } from 'lucide-react';
import { slotApi, exceptionApi } from '../services/api';
import { Slot, SlotException, WeeklySchedule } from '../types';
import { formatTime, getDayName, getTimeSlotDuration } from '../utils/helpers';
import WeeklyCalendar from '../components/WeeklyCalendar';
import SlotCard from '../components/SlotCard';
import ExceptionCard from '../components/ExceptionCard';
import CreateSlotModal from '../components/CreateSlotModal';
import CreateExceptionModal from '../components/CreateExceptionModal';

const Dashboard: React.FC = () => {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [recentExceptions, setRecentExceptions] = useState<SlotException[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const [showCreateException, setShowCreateException] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [schedule, exceptions] = await Promise.all([
        slotApi.getWeeklySchedule(),
        exceptionApi.getExceptionsByDateRange(
          new Date().toISOString().split('T')[0],
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        )
      ]);
      
      setWeeklySchedule(schedule);
      setRecentExceptions(exceptions.slice(0, 5)); // Show only recent 5 exceptions
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotCreated = () => {
    setShowCreateSlot(false);
    loadDashboardData();
  };

  const handleExceptionCreated = () => {
    setShowCreateException(false);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dark-700 border-t-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-dark-900 rounded-xl border border-dark-700 p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-foreground">Error</h3>
        <p className="mt-1 text-sm text-dark-400">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalSlots = Object.values(weeklySchedule).flat().length;
  const activeSlots = Object.values(weeklySchedule).flat().filter(slot => slot.is_active).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">Dashboard</h1>
          <p className="mt-2 text-dark-400">
            Manage your recurring weekly slots and exceptions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowCreateSlot(true)}
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Slot
          </button>
          <button
            onClick={() => setShowCreateException(true)}
            className="btn btn-secondary btn-md"
          >
            <Calendar className="h-4 w-4 mr-2" />
            New Exception
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-dark-800 to-dark-900 hover:shadow-xl transition-shadow">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-primary-600/20 rounded-lg">
                <Clock className="h-6 w-6 text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-400">Total Slots</p>
                <p className="text-3xl font-bold text-foreground">{totalSlots}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-dark-800 to-dark-900 hover:shadow-xl transition-shadow">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-600/20 rounded-lg">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-400">Active Slots</p>
                <p className="text-3xl font-bold text-foreground">{activeSlots}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-dark-800 to-dark-900 hover:shadow-xl transition-shadow">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-orange-600/20 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-400">Recent Exceptions</p>
                <p className="text-3xl font-bold text-foreground">{recentExceptions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-foreground">Weekly Calendar</h2>
          <p className="text-sm text-dark-400 mt-1">
            Manage your recurring slots with infinite scroll and exception handling
          </p>
        </div>
        <div className="card-content">
          <WeeklyCalendar 
            onSlotCreate={loadDashboardData}
            onSlotUpdate={loadDashboardData}
            onSlotDelete={loadDashboardData}
          />
        </div>
      </div>

      {/* Recent Exceptions */}
      {recentExceptions.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold text-foreground">Recent Exceptions</h2>
            <p className="text-sm text-dark-400 mt-1">
              Latest modifications to recurring slots
            </p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentExceptions.map((exception) => (
                <ExceptionCard
                  key={exception.id}
                  exception={exception}
                  onUpdate={loadDashboardData}
                  onDelete={loadDashboardData}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateSlot && (
        <CreateSlotModal
          onClose={() => setShowCreateSlot(false)}
          onSuccess={handleSlotCreated}
        />
      )}

      {showCreateException && (
        <CreateExceptionModal
          onClose={() => setShowCreateException(false)}
          onSuccess={handleExceptionCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
