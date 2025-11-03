import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CreateExceptionRequest, Slot } from '../types';
import { exceptionApi, slotApi } from '../services/api';
import { validateTimeFormat, validateTimeRange } from '../utils/helpers';
import toast from 'react-hot-toast';

interface CreateExceptionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateExceptionModal: React.FC<CreateExceptionModalProps> = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateExceptionRequest>({
    defaultValues: {
      is_cancelled: false,
      exception_date: new Date().toISOString().split('T')[0],
    }
  });

  const watchedStartTime = watch('start_time');
  const watchedEndTime = watch('end_time');
  const watchedIsCancelled = watch('is_cancelled');

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);
      const slotsData = await slotApi.getAllSlots();
      setSlots(slotsData.filter(slot => slot.is_active));
    } catch (error) {
      toast.error('Failed to load slots');
      console.error('Load slots error:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onSubmit = async (data: CreateExceptionRequest) => {
    try {
      setIsSubmitting(true);
      await exceptionApi.createException(data);
      toast.success('Exception created successfully');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create exception';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateTime = (time: string) => {
    if (!time) return true; // Optional field
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
            <Calendar className="h-5 w-5 mr-2 text-primary-400" />
            Create Exception
          </h3>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-foreground rounded-lg hover:bg-dark-800 p-1 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Slot *
            </label>
            {loadingSlots ? (
              <div className="input w-full flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-sm text-dark-400">Loading slots...</span>
              </div>
            ) : (
              <select
                {...register('slot_id', { required: 'Slot is required' })}
                className="input w-full"
              >
                <option value="">Select a slot</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.title} - {slot.start_time} to {slot.end_time}
                  </option>
                ))}
              </select>
            )}
            {errors.slot_id && (
              <p className="mt-1 text-sm text-red-400">{errors.slot_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Exception Date *
            </label>
            <input
              {...register('exception_date', { required: 'Exception date is required' })}
              type="date"
              className="input w-full"
            />
            {errors.exception_date && (
              <p className="mt-1 text-sm text-red-400">{errors.exception_date.message}</p>
            )}
          </div>

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
              placeholder="Enter reason for this exception (optional)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingSlots}
              className="btn btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Exception'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExceptionModal;







