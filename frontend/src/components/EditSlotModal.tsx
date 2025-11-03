import React, { useState } from 'react';
import { X, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { slotApi } from '../services/api';
import { formatTime, formatDate, getDayName } from '../utils/helpers';
import { validateTimeFormat, validateTimeRange } from '../utils/helpers';
import toast from 'react-hot-toast';

interface EditSlotModalProps {
  slot: any;
  date: string;
  onClose: () => void;
  onSuccess: (exception?: any) => void;
}

const EditSlotModal: React.FC<EditSlotModalProps> = ({ 
  slot, 
  date, 
  onClose, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      start_time: slot.is_exception && slot.modified_start_time 
        ? slot.modified_start_time 
        : slot.start_time,
      end_time: slot.is_exception && slot.modified_end_time 
        ? slot.modified_end_time 
        : slot.end_time,
      reason: slot.exception_reason || '',
      is_cancelled: slot.is_cancelled || false
    }
  });

  const watchedStartTime = watch('start_time');
  const watchedEndTime = watch('end_time');
  const watchedIsCancelled = watch('is_cancelled');

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      let updatedException;
      if (data.is_cancelled) {
        // Cancel the slot for this date
        updatedException = await slotApi.updateSlotWithException(slot.id, date, {
          is_cancelled: true,
          reason: data.reason
        });
      } else {
        // Update the slot for this date
        updatedException = await slotApi.updateSlotWithException(slot.id, date, {
          start_time: data.start_time,
          end_time: data.end_time,
          is_cancelled: false,
          reason: data.reason
        });
      }
      
      onSuccess(updatedException);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update slot';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this slot for this date?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const deletedException = await slotApi.updateSlotWithException(slot.id, date, {
        is_cancelled: true,
        reason: 'Slot deleted'
      });
      onSuccess(deletedException);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete slot';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this slot for this date?')) {
      return;
    }

    try {
      setIsCancelling(true);
      const cancelledException = await slotApi.updateSlotWithException(slot.id, date, {
        is_cancelled: true,
        reason: 'Slot cancelled'
      });
      onSuccess(cancelledException);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel slot';
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const validateTime = (time: string) => {
    if (!time) return 'Time is required';
    if (!validateTimeFormat(time)) return 'Invalid time format (HH:MM)';
    return true;
  };

  const validateTimeRange = (endTime: string) => {
    if (watchedIsCancelled || !watchedStartTime || !endTime) return true;
    if (!validateTimeRange(watchedStartTime, endTime)) {
      return 'End time must be after start time';
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="relative mx-auto p-6 border w-96 shadow-2xl rounded-xl bg-dark-900 border-dark-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-400" />
            Edit Slot
          </h3>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-foreground rounded-lg hover:bg-dark-800 p-1 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-dark-800 rounded-lg border border-dark-700">
          <div className="text-sm text-foreground">
            <div className="font-medium">{slot.title}</div>
            <div className="text-xs text-dark-400">
              {formatDate(date)} • {getDayName(new Date(date).getDay())}
            </div>
            {slot.is_exception && (
              <div className="flex items-center mt-1 text-xs text-amber-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                This slot has been modified for this date
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center">
            <input
              {...register('is_cancelled')}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-700 rounded"
            />
            <label className="ml-2 block text-sm text-foreground">
              Cancel this slot for this date
            </label>
          </div>

          {!watchedIsCancelled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Time
                  </label>
                  <input
                    {...register('start_time', { validate: validateTime })}
                    type="time"
                    className="input w-full"
                  />
                  {errors.start_time && (
                    <p className="mt-1 text-sm text-red-400">{errors.start_time.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Time
                  </label>
                  <input
                    {...register('end_time', { validate: validateTimeRange })}
                    type="time"
                    className="input w-full"
                  />
                  {errors.end_time && (
                    <p className="mt-1 text-sm text-red-400">{errors.end_time.message}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reason
            </label>
            <textarea
              {...register('reason')}
              className="input w-full h-20 resize-none"
              placeholder="Enter reason for this change (optional)"
            />
          </div>

          <div className="flex justify-between space-x-3 pt-4">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelling || slot.is_cancelled}
                className="btn btn-secondary disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Slot'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-danger disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSlotModal;






