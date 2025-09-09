import { useState } from 'react';
import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Switch } from '../primitives/Switch';
import { cn } from '../../lib/cn';
import { EXPORT_FIELDS, EXPORT_FIELD_CATEGORIES } from '../../services/export/export.types';
import type { ExportOptions } from '../../services/export/export.types';

interface ExportOptionsModalProps {
  availableDays: Array<{
    id: string;
    date: string;
    location: string;
    participants: Array<{
      status: 'registered' | 'waiting' | 'confirmed' | 'cancelled';
    }>;
  }>;
  onConfirm: (options: ExportOptions) => void;
  onCancel: () => void;
}

export function ExportOptionsModal({ 
  availableDays, 
  onConfirm, 
  onCancel 
}: ExportOptionsModalProps) {
  const [options, setOptions] = useState<ExportOptions>({
    selectedFields: EXPORT_FIELDS
      .filter(field => field.required || field.category === 'basic')
      .map(field => field.key),
    selectedDays: availableDays.map(day => day.id),
    includeSummary: true,
    includeWaiting: false,
    includeCancelled: false,
    dateRange: null,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [errors, setErrors] = useState<string[]>([]);

  const handleFieldToggle = (fieldKey: string) => {
    setOptions(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldKey)
        ? prev.selectedFields.filter(key => key !== fieldKey)
        : [...prev.selectedFields, fieldKey]
    }));
  };

  const handleDayToggle = (dayId: string) => {
    setOptions(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(id => id !== dayId)
        : [...prev.selectedDays, dayId]
    }));
  };

  const handleSelectAllFields = () => {
    setOptions(prev => ({
      ...prev,
      selectedFields: EXPORT_FIELDS.map(field => field.key)
    }));
  };

  const handleSelectNoFields = () => {
    setOptions(prev => ({
      ...prev,
      selectedFields: EXPORT_FIELDS
        .filter(field => field.required)
        .map(field => field.key)
    }));
  };

  const handleSelectAllDays = () => {
    setOptions(prev => ({
      ...prev,
      selectedDays: availableDays.map(day => day.id)
    }));
  };

  const handleSelectNoDays = () => {
    setOptions(prev => ({
      ...prev,
      selectedDays: []
    }));
  };

  const handleConfirm = () => {
    const newErrors: string[] = [];
    
    if (options.selectedFields.length === 0) {
      newErrors.push('At least one field must be selected');
    }
    
    if (options.selectedDays.length === 0) {
      newErrors.push('At least one day must be selected');
    }
    
    setErrors(newErrors);
    
    if (newErrors.length === 0) {
      onConfirm(options);
    }
  };

  const filteredFields = selectedCategory === 'all' 
    ? EXPORT_FIELDS 
    : EXPORT_FIELDS.filter(field => field.category === selectedCategory);

  // Calculate participant counts based on current filters
  const getParticipantCounts = () => {
    const selectedDaysData = availableDays.filter(day => 
      options.selectedDays.includes(day.id)
    );
    
    let totalParticipants = 0;
    let confirmedCount = 0;
    let registeredCount = 0;
    let waitingCount = 0;
    let cancelledCount = 0;

    selectedDaysData.forEach(day => {
      day.participants.forEach(participant => {
        totalParticipants++;
        
        if (participant.status === 'confirmed') confirmedCount++;
        else if (participant.status === 'registered') registeredCount++;
        else if (participant.status === 'waiting') waitingCount++;
        else if (participant.status === 'cancelled') cancelledCount++;
      });
    });

    let exportCount = confirmedCount + registeredCount;
    if (options.includeWaiting) exportCount += waitingCount;
    if (options.includeCancelled) exportCount += cancelledCount;

    return {
      total: totalParticipants,
      export: exportCount,
      confirmed: confirmedCount,
      registered: registeredCount,
      waiting: waitingCount,
      cancelled: cancelledCount,
    };
  };

  const participantCounts = getParticipantCounts();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Export Options
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Configure what data to include in your Excel export
          </Text>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Text className="text-red-800 dark:text-red-200 font-medium mb-2">
                Please fix the following errors:
              </Text>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Export Summary */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Heading className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
              Export Summary
            </Heading>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {participantCounts.export}
                </div>
                <Text className="text-sm text-blue-800 dark:text-blue-200">
                  Will Export
                </Text>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                  {participantCounts.confirmed + participantCounts.registered}
                </div>
                <Text className="text-sm text-blue-800 dark:text-blue-200">
                  Confirmed + Registered
                </Text>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                  {options.includeWaiting ? participantCounts.waiting : 0}
                </div>
                <Text className="text-sm text-blue-800 dark:text-blue-200">
                  Waiting {options.includeWaiting ? '(included)' : '(excluded)'}
                </Text>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-red-600 dark:text-red-400">
                  {options.includeCancelled ? participantCounts.cancelled : 0}
                </div>
                <Text className="text-sm text-blue-800 dark:text-blue-200">
                  Cancelled {options.includeCancelled ? '(included)' : '(excluded)'}
                </Text>
              </div>
            </div>
            <div className="mt-3 text-center">
              <Text className="text-sm text-blue-700 dark:text-blue-300">
                Total participants in selected days: {participantCounts.total}
              </Text>
            </div>
          </div>

          {/* Days Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Heading className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Select Days
              </Heading>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSelectAllDays}
                >
                  Select All
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSelectNoDays}
                >
                  Select None
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableDays.map(day => (
                <label
                  key={day.id}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={options.selectedDays.includes(day.id)}
                    onChange={() => handleDayToggle(day.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="ml-3">
                    <Text className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {day.location}
                    </Text>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Fields Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Heading className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Select Fields
              </Heading>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSelectAllFields}
                >
                  Select All
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSelectNoFields}
                >
                  Select None
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                All Fields
              </button>
              {EXPORT_FIELD_CATEGORIES.map(category => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === category.key
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Fields List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFields.map(field => (
                <label
                  key={field.key}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={options.selectedFields.includes(field.key)}
                    onChange={() => handleFieldToggle(field.key)}
                    disabled={field.required}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                  />
                  <div className="ml-3 flex-1">
                    <Text className="font-medium text-gray-900 dark:text-gray-100">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {field.category.replace('_', ' ')}
                    </Text>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6">
            <Heading className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Additional Options
            </Heading>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Text className="font-medium text-gray-900 dark:text-gray-100">
                    Include Summary Sheet
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Add a summary sheet with event statistics
                  </Text>
                </div>
                <Switch
                  checked={options.includeSummary}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeSummary: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Text className="font-medium text-gray-900 dark:text-gray-100">
                    Include Waiting Participants
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Export participants with waiting status
                  </Text>
                </div>
                <Switch
                  checked={options.includeWaiting}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeWaiting: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Text className="font-medium text-gray-900 dark:text-gray-100">
                    Include Cancelled Participants
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Export participants with cancelled status
                  </Text>
                </div>
                <Switch
                  checked={options.includeCancelled}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeCancelled: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Export to Excel
          </Button>
        </div>
      </Card>
    </div>
  );
}
