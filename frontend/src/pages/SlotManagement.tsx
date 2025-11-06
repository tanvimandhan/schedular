import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Slot } from '../types';
import { slotApi } from '../services/api';
import { formatTime, getDayName, getTimeSlotDuration, formatDate } from '../utils/helpers';
import CreateSlotModal from '../components/CreateSlotModal';
import toast from 'react-hot-toast';

const SlotManagement: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadSlots();
  }, []);

  useEffect(() => {
    filterSlots();
  }, [slots, searchTerm, filterDay, filterStatus]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const slotsData = await slotApi.getAllSlots();
      setSlots(slotsData);
    } catch (err) {
      setError('Failed to load slots');
      console.error('Load slots error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSlots = () => {
    let filtered = [...slots];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(slot =>
        slot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Day filter
    if (filterDay !== 'all') {
      filtered = filtered.filter(slot => slot.day_of_week === parseInt(filterDay));
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(slot => 
        filterStatus === 'active' ? slot.is_active : !slot.is_active
      );
    }

    setFilteredSlots(filtered);
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) {
      return;
    }

    try {
      await slotApi.deleteSlot(slotId);
      toast.success('Slot deleted successfully');
      loadSlots();
    } catch (error) {
      toast.error('Failed to delete slot');
      console.error('Delete slot error:', error);
    }
  };

  const handleToggleActive = async (slot: Slot) => {
    try {
      await slotApi.updateSlot(slot.id, { is_active: !slot.is_active });
      toast.success(`Slot ${slot.is_active ? 'deactivated' : 'activated'} successfully`);
      loadSlots();
    } catch (error) {
      toast.error('Failed to update slot');
      console.error('Update slot error:', error);
    }
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
          onClick={loadSlots}
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">Slot Management</h1>
          <p className="mt-2 text-dark-400">
            Manage your recurring weekly slots
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Slot
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
                  placeholder="Search slots..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Day of Week
              </label>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="input"
              >
                <option value="all">All Days</option>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                  <option key={index} value={index.toString()}>
                    {day}
                  </option>
                ))}
              </select>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDay('all');
                  setFilterStatus('all');
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

      {/* Slots List */}
      <div className="space-y-4">
        {filteredSlots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-dark-500 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No slots found</h3>
            <p className="text-dark-400 mb-4">
              {searchTerm || filterDay !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first slot'
              }
            </p>
            {!searchTerm && filterDay === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Slot
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSlots.map((slot) => (
              <div key={slot.id} className="card hover:shadow-xl transition-all">
                <div className="card-content">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{slot.title}</h3>
                        <div className="flex items-center space-x-1">
                          {slot.is_recurring && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400 border border-green-600/30">
                              Recurring
                            </span>
                          )}
                          {!slot.is_active && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {slot.description && (
                        <p className="text-dark-400 mb-3">{slot.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm text-dark-400">
                        <div className="flex items-center">
                          <span className="font-medium text-foreground">Day:</span>
                          <span className="ml-2">{getDayName(slot.day_of_week)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium text-foreground">Time:</span>
                          <span className="ml-2">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            <span className="mx-1">({getTimeSlotDuration(slot.start_time, slot.end_time)})</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium text-foreground">Effective:</span>
                          <span className="ml-2">
                            {formatDate(slot.effective_from)}
                            {slot.effective_until && (
                              <span> to {formatDate(slot.effective_until)}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(slot)}
                        className="p-2 text-dark-400 hover:text-foreground rounded-lg hover:bg-dark-800 transition-all"
                        title={slot.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-2 text-dark-400 hover:text-red-400 rounded-lg hover:bg-dark-800 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateSlotModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadSlots();
          }}
        />
      )}
    </div>
  );
};

export default SlotManagement;








