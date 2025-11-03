import React, { useState } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CreateSlotRequest } from '../types';
import { slotApi } from '../services/api';
import { DAYS_OF_WEEK } from '../types';
import { validateTimeFormat, validateTimeRange as isValidTimeRange } from '../utils/helpers';
import toast from 'react-hot-toast';

interface CreateSlotModalProps {
  onClose: () => void;
  onSuccess: (slot?: any) => void;
  defaultDate?: string;
}

const CreateSlotModal: React.FC<CreateSlotModalProps> = ({ onClose, onSuccess, defaultDate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateSlotRequest>({
    defaultValues: {
      is_recurring: true,
      effective_from: defaultDate || new Date().toISOString().split('T')[0],
    }
  });

  // Set day of week based on default date
  React.useEffect(() => {
    if (defaultDate) {
      const date = new Date(defaultDate);
      setValue('day_of_week', date.getDay());
    }
  }, [defaultDate, setValue]);

  const watchedStartTime = watch('start_time');
  const watchedEndTime = watch('end_time');

  const onSubmit = async (data: CreateSlotRequest) => {
    try {
      setIsSubmitting(true);
      const createdSlot = await slotApi.createSlot(data);
      onSuccess(createdSlot);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create slot';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateTime = (time: string) => {
    if (!time) return 'Time is required';
    if (!validateTimeFormat(time)) return 'Invalid time format (HH:MM)';
    return true;
  };

  const validateEndTime = (endTime: string) => {
    if (!watchedStartTime || !endTime) return true;
    if (!isValidTimeRange(watchedStartTime, endTime)) {
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
            Create New Slot
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
              Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="input w-full"
              placeholder="Enter slot title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              className="input w-full h-20 resize-none"
              placeholder="Enter slot description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Day of Week *
            </label>
            <select
              {...register('day_of_week', { required: 'Day of week is required' })}
              className="input w-full"
            >
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
            {errors.day_of_week && (
              <p className="mt-1 text-sm text-red-400">{errors.day_of_week.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Time *
              </label>
              <input
                {...register('start_time', { 
                  required: 'Start time is required',
                  validate: validateTime
                })}
                type="time"
                className="input w-full"
              />
              {errors.start_time && (
                <p className="mt-1 text-sm text-red-400">{errors.start_time.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Time *
              </label>
              <input
                {...register('end_time', { 
                  required: 'End time is required',
                  validate: validateEndTime
                })}
                type="time"
                className="input w-full"
              />
              {errors.end_time && (
                <p className="mt-1 text-sm text-red-400">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Effective From *
            </label>
            <input
              {...register('effective_from', { required: 'Effective from date is required' })}
              type="date"
              className="input w-full"
            />
            {errors.effective_from && (
              <p className="mt-1 text-sm text-red-400">{errors.effective_from.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Effective Until
            </label>
            <input
              {...register('effective_until')}
              type="date"
              className="input w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              {...register('is_recurring')}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-700 rounded"
            />
            <label className="ml-2 block text-sm text-foreground">
              Recurring slot
            </label>
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
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSlotModal;
