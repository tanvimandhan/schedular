import React, { useState } from 'react';
import { Calendar, Clock, Edit, Trash2, MoreVertical, AlertCircle } from 'lucide-react';
import { SlotException, Slot } from '../types';
import { formatTime, formatDate } from '../utils/helpers';
import { exceptionApi, slotApi } from '../services/api';
import toast from 'react-hot-toast';

interface ExceptionCardProps {
  exception: SlotException;
  onUpdate: () => void;
  onDelete: () => void;
  slot?: Slot;
}

const ExceptionCard: React.FC<ExceptionCardProps> = ({ 
  exception, 
  onUpdate, 
  onDelete,
  slot 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this exception?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await exceptionApi.deleteException(exception.id);
      toast.success('Exception deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete exception');
      console.error('Delete exception error:', error);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleToggleCancelled = async () => {
    try {
      await exceptionApi.updateException(exception.id, { 
        is_cancelled: !exception.is_cancelled 
      });
      toast.success(`Exception ${exception.is_cancelled ? 'restored' : 'cancelled'} successfully`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update exception');
      console.error('Update exception error:', error);
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
              <h3 className="text-lg font-semibold text-foreground">
                {slot?.title || 'Unknown Slot'}
              </h3>
              <div className="flex items-center space-x-1">
                {exception.is_cancelled ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Cancelled
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-600/20 text-amber-400 border border-amber-600/30">
                    Modified
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-dark-400">
                <Calendar className="h-4 w-4 mr-2 text-primary-400" />
                <span>{formatDate(exception.exception_date)}</span>
              </div>
              
              {!exception.is_cancelled && exception.start_time && exception.end_time && (
                <div className="flex items-center text-sm text-dark-400">
                  <Clock className="h-4 w-4 mr-2 text-primary-400" />
                  <span>
                    {formatTime(exception.start_time)} - {formatTime(exception.end_time)}
                  </span>
                </div>
              )}
              
              {exception.reason && (
                <div className="text-sm text-dark-400">
                  <span className="font-medium text-foreground">Reason:</span> {exception.reason}
                </div>
              )}
            </div>
          </div>
          
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
                    onClick={handleToggleCancelled}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-dark-800 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {exception.is_cancelled ? 'Restore' : 'Cancel'}
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
        </div>
      </div>
    </div>
  );
};

export default ExceptionCard;








