import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as api from '../../services/api';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// A basic list of common timezones for the autocomplete/select
// @ts-ignore - TS might not know about Intl.supportedValuesOf
const COMMON_TIMEZONES = typeof (Intl as any).supportedValuesOf === 'function'
  ? (Intl as any).supportedValuesOf('timeZone')
  : ['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney', 'UTC'];

export const CalendarSettings: React.FC = () => {
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [weeklyHours, setWeeklyHours] = useState<Record<string, api.TimeWindow[]>>({});
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const schedule = await api.getMySchedule();
        if (schedule.timezone) setTimezone(schedule.timezone);

        // Initialize all days if missing
        const initialHours: Record<string, api.TimeWindow[]> = {};
        DAYS_OF_WEEK.forEach(day => {
          initialHours[day] = schedule.weeklyHours?.[day] || [];
        });
        setWeeklyHours(initialHours);
        setBlockedDates(schedule.blockedDates || []);
      } catch (error) {
        toast.error('Failed to load availability settings');
        // Default empty state
        const emptyHours: Record<string, api.TimeWindow[]> = {};
        DAYS_OF_WEEK.forEach(day => emptyHours[day] = []);
        setWeeklyHours(emptyHours);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving availability...');
    try {
      await api.updateSchedule({
        timezone,
        weeklyHours,
        blockedDates
      });
      toast.success('Availability saved successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to save availability', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const addTimeWindow = (day: string) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '09:00', end: '17:00' }]
    }));
  };

  const removeTimeWindow = (day: string, index: number) => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updateTimeWindow = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setWeeklyHours(prev => {
      const newDayHours = [...prev[day]];
      newDayHours[index] = { ...newDayHours[index], [field]: value };
      return { ...prev, [day]: newDayHours };
    });
  };

  const toggleDay = (day: string) => {
    setWeeklyHours(prev => {
      if (prev[day].length > 0) {
        return { ...prev, [day]: [] }; // Turn off
      } else {
        return { ...prev, [day]: [{ start: '09:00', end: '17:00' }] }; // Turn on
      }
    });
  };

  const handleAddBlockedDate = () => {
    if (newBlockedDate && !blockedDates.includes(newBlockedDate)) {
      setBlockedDates([...blockedDates, newBlockedDate]);
      setNewBlockedDate('');
    }
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    setBlockedDates(blockedDates.filter(d => d !== dateToRemove));
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl w-full"></div>;
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Calendar & Availability
        </h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Timezone Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-1 text-gray-400" /> Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {COMMON_TIMEZONES.map((tz: string) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">All your booking slots will be based on this central timezone.</p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Weekly Hours</h3>

          <div className="space-y-4">
            {DAYS_OF_WEEK.map(day => {
              const isActive = weeklyHours[day].length > 0;

              return (
                <div key={day} className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 transition-colors hover:border-blue-100">

                  {/* Day Toggle */}
                  <div className="flex items-center w-32 shrink-0 pt-2">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={isActive} onChange={() => toggleDay(day)} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900 capitalize">
                        {day.substring(0, 3).toLowerCase()}
                      </span>
                    </label>
                  </div>

                  {/* Intervals */}
                  <div className="flex-1 space-y-3">
                    {!isActive ? (
                      <div className="text-sm text-gray-400 py-2">Unavailable</div>
                    ) : (
                      <>
                        {weeklyHours[day].map((window, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={window.start}
                              onChange={(e) => updateTimeWindow(day, idx, 'start', e.target.value)}
                              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                              type="time"
                              value={window.end}
                              onChange={(e) => updateTimeWindow(day, idx, 'end', e.target.value)}
                              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                              onClick={() => removeTimeWindow(day, idx)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {idx === weeklyHours[day].length - 1 && (
                              <button
                                onClick={() => addTimeWindow(day)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Add another interval"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Date Overrides */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Specific Blocked Dates</h3>
          <p className="text-xs text-gray-500 mb-4">Add single dates where you are completely unavailable (e.g., vacations, holidays).</p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Prevents past dates
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleAddBlockedDate}
              disabled={!newBlockedDate}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>

          {blockedDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blockedDates.sort().map(date => (
                <div key={date} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  <button
                    onClick={() => handleRemoveBlockedDate(date)}
                    className="p-0.5 hover:bg-red-100 rounded flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
