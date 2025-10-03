import type { HostWithAssignments } from '../endpoints/host.types';

export interface HostExportField {
  key: keyof HostWithAssignments | 'event_day' | 'location_name' | 'capacity_utilization';
  label: string;
  category: 'basic' | 'accommodation' | 'preferences' | 'assignments' | 'additional';
  required?: boolean;
}

export interface HostExportOptions {
  selectedFields: string[];
  selectedDays: string[];
  includeUnassignedHosts: boolean;
  includeAssignmentDetails: boolean;
  capacityFilter?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ExportHostData extends Omit<HostWithAssignments, 'id' | 'created_at' | 'updated_at'> {
  event_day: string;
  location_name: string;
  day_number: number;
  row_number: number;
  capacity_utilization: number;
}

export interface ExportHostSummaryData {
  event_name: string;
  event_dates: string;
  total_hosts: number;
  total_days: number;
  total_capacity: number;
  total_assigned: number;
  available_capacity: number;
  hosts_by_type: {
    toilet_facilities: Record<string, number>;
    gender_preference: Record<string, number>;
  };
  capacity_utilization: {
    fully_utilized: number;
    partially_utilized: number;
    available: number;
    over_capacity: number;
  };
  average_capacity_per_host: number;
}

export const HOST_EXPORT_FIELDS: HostExportField[] = [
  // Basic Information (Always included)
  { key: 'name', label: 'Host Name', category: 'basic', required: true },
  { key: 'phone_no', label: 'Phone Number', category: 'basic', required: true },
  { key: 'place_name', label: 'Place Name', category: 'basic', required: true },
  { key: 'max_participants', label: 'Max Capacity', category: 'basic', required: true },
  { key: 'current_capacity', label: 'Current Capacity', category: 'basic', required: true },
  { key: 'capacity_utilization', label: 'Capacity Utilization %', category: 'basic' },
  
  // Accommodation Details
  { key: 'facilities_description', label: 'Facilities Description', category: 'accommodation' },
  { key: 'toilet_facilities', label: 'Toilet Facilities', category: 'accommodation' },
  { key: 'gender_preference', label: 'Gender Preference', category: 'accommodation' },
  
  // Assignment Information
  { key: 'assignments', label: 'Assignments', category: 'assignments' },
  
  // Additional Information
  { key: 'event_id', label: 'Event ID', category: 'additional' },
  { key: 'event_day', label: 'Event Day', category: 'additional' },
  { key: 'location_name', label: 'Location', category: 'additional' },
];

export const HOST_EXPORT_FIELD_CATEGORIES = [
  { key: 'basic', label: 'Basic Information', color: 'blue' },
  { key: 'accommodation', label: 'Accommodation Details', color: 'purple' },
  { key: 'preferences', label: 'Host Preferences', color: 'green' },
  { key: 'assignments', label: 'Assignment Information', color: 'orange' },
  { key: 'additional', label: 'Additional Information', color: 'gray' },
] as const;
