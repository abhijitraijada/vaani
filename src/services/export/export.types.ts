import type { Participant } from '../endpoints/dashboard.types';

export interface ExportField {
  key: keyof Participant | 'event_day' | 'location_name';
  label: string;
  category: 'basic' | 'registration' | 'accommodation' | 'participation' | 'transportation' | 'additional';
  required?: boolean;
}

export interface ExportOptions {
  selectedFields: string[];
  selectedDays: string[];
  includeSummary: boolean;
  includeWaiting: boolean;
  includeCancelled: boolean;
  dateRange: {
    start: string;
    end: string;
  } | null;
}

export interface ExportProgress {
  isExporting: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
}

export interface ExportParticipantData extends Omit<Participant, 'id'> {
  event_day: string;
  location_name: string;
  day_number: number;
  row_number: number;
}

export interface ExportSummaryData {
  event_name: string;
  event_dates: string;
  total_participants: number;
  total_days: number;
  confirmed_participants: number;
  waiting_participants: number;
  total_groups: number;
  group_registrations: number;
  individual_registrations: number;
  public_transport: number;
  private_transport: number;
  total_empty_seats: number;
  groups_with_empty_seats: number;
  gender_distribution: {
    male: number;
    female: number;
  };
  age_groups: Record<string, number>;
  city_distribution: Record<string, number>;
  toilet_preferences: {
    indian: number;
    western: number;
  };
}

export const EXPORT_FIELDS: ExportField[] = [
  // Basic Information (Always included)
  { key: 'name', label: 'Name', category: 'basic', required: true },
  { key: 'phone_number', label: 'Phone', category: 'basic', required: true },
  { key: 'email', label: 'Email', category: 'basic', required: true },
  { key: 'age', label: 'Age', category: 'basic', required: true },
  { key: 'gender', label: 'Gender', category: 'basic', required: true },
  { key: 'city', label: 'City', category: 'basic', required: true },
  { key: 'status', label: 'Status', category: 'basic', required: true },
  
  // Registration Details
  { key: 'language', label: 'Language', category: 'registration' },
  { key: 'registration_type', label: 'Registration Type', category: 'registration' },
  { key: 'group_id', label: 'Group ID', category: 'registration' },
  { key: 'created_at', label: 'Registration Date', category: 'registration' },
  { key: 'updated_at', label: 'Last Updated', category: 'registration' },
  
  // Accommodation & Preferences
  { key: 'floor_preference', label: 'Floor Preference', category: 'accommodation' },
  { key: 'special_requirements', label: 'Special Requirements', category: 'accommodation' },
  { key: 'physical_limitations', label: 'Physical Limitations', category: 'accommodation' },
  { key: 'toilet_preference', label: 'Toilet Preference', category: 'accommodation' },
  
  // Event Participation
  { key: 'staying_with_yatra', label: 'Staying with Yatra', category: 'participation' },
  { key: 'dinner_at_host', label: 'Dinner at Host', category: 'participation' },
  { key: 'breakfast_at_host', label: 'Breakfast at Host', category: 'participation' },
  { key: 'lunch_with_yatra', label: 'Lunch with Yatra', category: 'participation' },
  
  // Transportation
  { key: 'transportation_mode', label: 'Transportation Mode', category: 'transportation' },
  { key: 'has_empty_seats', label: 'Has Empty Seats', category: 'transportation' },
  { key: 'available_seats_count', label: 'Available Seats', category: 'transportation' },
  
  // Additional Information
  { key: 'notes', label: 'Notes', category: 'additional' },
  { key: 'event_day', label: 'Event Day', category: 'additional' },
  { key: 'location_name', label: 'Location', category: 'additional' },
];

export const EXPORT_FIELD_CATEGORIES = [
  { key: 'basic', label: 'Basic Information', color: 'blue' },
  { key: 'registration', label: 'Registration Details', color: 'green' },
  { key: 'accommodation', label: 'Accommodation & Preferences', color: 'purple' },
  { key: 'participation', label: 'Event Participation', color: 'orange' },
  { key: 'transportation', label: 'Transportation', color: 'indigo' },
  { key: 'additional', label: 'Additional Information', color: 'gray' },
] as const;
