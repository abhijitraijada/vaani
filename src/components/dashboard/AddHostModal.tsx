import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Heading, Text } from '../primitives/Typography';
import { cn } from '../../lib/cn';
import type { CreateHostRequest, ToiletFacilities, GenderPreference } from '../../services/endpoints/host.types';

interface AddHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hostData: CreateHostRequest) => Promise<void>;
  eventId: string;
  className?: string;
}

export function AddHostModal({ isOpen, onClose, onSubmit, eventId, className }: AddHostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateHostRequest>({
    event_id: eventId,
    name: '',
    phone_no: 0,
    place_name: '',
    max_participants: 1,
    toilet_facilities: 'both',
    gender_preference: 'both',
    facilities_description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Host name is required';
    }
    
    if (formData.phone_no.toString().length < 10) {
      newErrors.phone_no = 'Phone number must be at least 10 digits';
    }
    
    if (!formData.place_name.trim()) {
      newErrors.place_name = 'Place name is required';
    }
    
    if (formData.max_participants < 1) {
      newErrors.max_participants = 'Maximum participants must be at least 1';
    }
    
    if (!formData.facilities_description.trim()) {
      newErrors.facilities_description = 'Facilities description is required';


    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to add host:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form data
    setFormData({
      event_id: eventId,
      name: '',
      phone_no: 0,
      place_name: '',
      max_participants: 1,
      toilet_facilities: 'both',
      gender_preference: 'both',
      facilities_description: ''
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof CreateHostRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={cn(
        'relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Add New Host
            </Heading>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Register a new host for event accommodation
            </Text>
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <Heading className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Basic Information
              </Heading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Host Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter host name"
                  />
                  {errors.name && (
                    <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_no || ''}
                    onChange={(e) => handleInputChange('phone_no', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.phone_no ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone_no && (
                    <Text className="text-red-500 text-sm mt-1">{errors.phone_no}</Text>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Place Name *
                </label>
                <input
                  type="text"
                  value={formData.place_name}
                  onChange={(e) => handleInputChange('place_name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.place_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter place/address name"
                />
                {errors.place_name && (
                  <Text className="text-red-500 text-sm mt-1">{errors.place_name}</Text>
                )}
              </div>
            </div>

            {/* Accommodation Details */}
            <div className="space-y-4">
              <Heading className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Accommodation Details
              </Heading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Participants *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.max_participants ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.max_participants && (
                    <Text className="text-red-500 text-sm mt-1">{errors.max_participants}</Text>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Toilet Facilities *
                  </label>
                  <select
                    value={formData.toilet_facilities}
                    onChange={(e) => handleInputChange('toilet_facilities', e.target.value as ToiletFacilities)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="indian">Indian</option>
                    <option value="western">Western</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender Preference *
                </label>
                <select
                  value={formData.gender_preference}
                  onChange={(e) => handleInputChange('gender_preference', e.target.value as GenderPreference)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="both">Both</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facilities Description *
                </label>
                <textarea
                  value={formData.facilities_description}
                  onChange={(e) => handleInputChange('facilities_description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.facilities_description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Describe available facilities (AC, WiFi, parking, etc.)"
                />
                {errors.facilities_description && (
                  <Text className="text-red-500 text-sm mt-1">{errors.facilities_description}</Text>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Host..." : "Add Host"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
