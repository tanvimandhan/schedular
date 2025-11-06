import React, { useState } from 'react';
import { Clock, Calendar, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Slot } from '../types';
import { formatTime, getDayName, getTimeSlotDuration, formatDate } from '../utils/helpers';
import { slotApi } from '../services/api';
import toast from 'react-hot-toast';

interface SlotCardProps {
  slot: Slot;
  onUpdate: () => void;
  onDelete: () => void;
  showActions?: boolean;
}

const SlotCard: React.FC<SlotCardProps> = ({ 
  slot, 
  onUpdate, 
  onDelete, 
  showActions = true 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this slot?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await slotApi.deleteSlot(slot.id);
      toast.success('Slot deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete slot');
      console.error('Delete slot error:', error);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      await slotApi.updateSlot(slot.id, { is_active: !slot.is_active });
      toast.success(`Slot ${slot.is_active ? 'deactivated' : 'activated'} successfully`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update slot');
      console.error('Update slot error:', error);
    } finally {
      setShowMenu(false);
    }
  };

  return (
    <div className="card hover:shadow-xl transition-all">
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
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-dark-400">
                <Calendar className="h-4 w-4 mr-2 text-primary-400" />
                <span>{getDayName(slot.day_of_week)}</span>
              </div>
              
              <div className="flex items-center text-sm text-dark-400">
                <Clock className="h-4 w-4 mr-2 text-primary-400" />
                <span>
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </span>
                <span className="mx-2">•</span>
                <span>{getTimeSlotDuration(slot.start_time, slot.end_time)}</span>
              </div>
              
              <div className="text-sm text-dark-400">
                <span className="font-medium text-foreground">Effective from:</span> {formatDate(slot.effective_from)}
                {slot.effective_until && (
                  <span>
                    <span className="mx-1">to</span>
                    {formatDate(slot.effective_until)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-dark-400 hover:text-foreground rounded-lg hover:bg-dark-800 transition-all"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-900 rounded-lg shadow-xl z-10 border border-dark-700">
                  <div className="py-1">
                    <button
                      onClick={handleToggleActive}
                      className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-dark-800 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {slot.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-800 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotCard;








