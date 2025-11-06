import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock } from 'lucide-react';
import { SlotException, Slot } from '../types';
import { exceptionApi, slotApi } from '../services/api';
import { formatTime, formatDate } from '../utils/helpers';
import CreateExceptionModal from '../components/CreateExceptionModal';
import toast from 'react-hot-toast';

const ExceptionManagement: React.FC = () => {
  const [exceptions, setExceptions] = useState<SlotException[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredExceptions, setFilteredExceptions] = useState<SlotException[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterExceptions();
  }, [exceptions, searchTerm, filterStatus, filterDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [exceptionsData, slotsData] = await Promise.all([
        exceptionApi.getAllExceptions(),
        slotApi.getAllSlots()
      ]);
      setExceptions(exceptionsData);
      setSlots(slotsData);
    } catch (err) {
      setError('Failed to load exceptions');
      console.error('Load exceptions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterExceptions = () => {
    let filtered = [...exceptions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exception => {
        const slot = slots.find(s => s.id === exception.slot_id);
        return slot?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               exception.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(exception => 
        filterStatus === 'cancelled' ? exception.is_cancelled : !exception.is_cancelled
      );
    }

    // Date filter
    if (filterDate) {
      filtered = filtered.filter(exception => 
        exception.exception_date === filterDate
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.exception_date).getTime() - new Date(a.exception_date).getTime());

    setFilteredExceptions(filtered);
  };

  const handleDeleteException = async (exceptionId: string) => {
    if (!window.confirm('Are you sure you want to delete this exception?')) {
      return;
    }

    try {
      await exceptionApi.deleteException(exceptionId);
      toast.success('Exception deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete exception');
      console.error('Delete exception error:', error);
    }
  };

  const handleToggleCancelled = async (exception: SlotException) => {
    try {
      await exceptionApi.updateException(exception.id, { 
        is_cancelled: !exception.is_cancelled 
      });
      toast.success(`Exception ${exception.is_cancelled ? 'restored' : 'cancelled'} successfully`);
      loadData();
    } catch (error) {
      toast.error('Failed to update exception');
      console.error('Update exception error:', error);
    }
  };

  const getSlotForException = (exception: SlotException): Slot | undefined => {
    return slots.find(slot => slot.id === exception.slot_id);
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
        <h3 className="mt-2 text-sm font-medium text-foreground">Error</h3>
        <p className="mt-1 text-sm text-dark-400">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">Exception Management</h1>
          <p className="mt-2 text-dark-400">
            Manage exceptions to your recurring slots
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Exception
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                  placeholder="Search exceptions..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="modified">Modified</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterDate('');
                }}
                className="btn btn-secondary w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exceptions List */}
      <div className="space-y-4">
        {filteredExceptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-dark-500 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No exceptions found</h3>
            <p className="text-dark-400 mb-4">
              {searchTerm || filterStatus !== 'all' || filterDate
                ? 'Try adjusting your filters'
                : 'Create exceptions to modify or cancel specific slot instances'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && !filterDate && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Exception
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExceptions.map((exception) => {
              const slot = getSlotForException(exception);
              return (
                <div key={exception.id} className="card hover:shadow-xl transition-all">
                  <div className="card-content">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {slot?.title || 'Unknown Slot'}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {exception.is_cancelled ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
                                Cancelled
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-600/20 text-amber-400 border border-amber-600/30">
                                Modified
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-dark-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary-400" />
                            <span className="font-medium text-foreground">Date:</span>
                            <span className="ml-2">{formatDate(exception.exception_date)}</span>
                          </div>
                          
                          {!exception.is_cancelled && exception.start_time && exception.end_time && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-primary-400" />
                              <span className="font-medium text-foreground">Time:</span>
                              <span className="ml-2">
                                {formatTime(exception.start_time)} - {formatTime(exception.end_time)}
                              </span>
                            </div>
                          )}
                          
                          {exception.reason && (
                            <div>
                              <span className="font-medium text-foreground">Reason:</span>
                              <span className="ml-2">{exception.reason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleCancelled(exception)}
                          className="p-2 text-dark-400 hover:text-foreground rounded-lg hover:bg-dark-800 transition-all"
                          title={exception.is_cancelled ? 'Restore' : 'Cancel'}
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteException(exception.id)}
                          className="p-2 text-dark-400 hover:text-red-400 rounded-lg hover:bg-dark-800 transition-all"
                          title="Delete"
                        >
                          <Filter className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateExceptionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default ExceptionManagement;








