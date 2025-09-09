import * as XLSX from 'xlsx';
import type { DashboardResponse, EventDay, Participant } from '../endpoints/dashboard.types';
import type { 
  ExportOptions, 
  ExportSummaryData, 
  ExportField
} from './export.types';
import { EXPORT_FIELDS } from './export.types';

export class ExcelExportService {
  private static instance: ExcelExportService;
  
  public static getInstance(): ExcelExportService {
    if (!ExcelExportService.instance) {
      ExcelExportService.instance = new ExcelExportService();
    }
    return ExcelExportService.instance;
  }

  /**
   * Generate Excel file with participant data organized by date
   */
  public async generateExcelFile(
    dashboardData: DashboardResponse,
    options: ExportOptions,
    onProgress?: (progress: number, step: string) => void
  ): Promise<void> {
    try {
      onProgress?.(10, 'Preparing data...');
      
      const workbook = XLSX.utils.book_new();
      
      // Add summary sheet if requested
      if (options.includeSummary) {
        onProgress?.(20, 'Creating summary sheet...');
        const summarySheet = this.createSummarySheet(dashboardData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      }

      // Filter and process selected days
      const selectedDays = this.getSelectedDays(dashboardData.daily_schedule, options);
      onProgress?.(30, `Processing ${selectedDays.length} days...`);

      // Create sheets for each selected day
      for (let i = 0; i < selectedDays.length; i++) {
        const day = selectedDays[i];
        const progress = 30 + ((i + 1) / selectedDays.length) * 60;
        onProgress?.(progress, `Creating sheet for ${day.event_date}...`);
        
        const daySheet = this.createDaySheet(day, options);
        const sheetName = this.getSheetName(day, i + 1);
        XLSX.utils.book_append_sheet(workbook, daySheet, sheetName);
      }

      onProgress?.(95, 'Generating file...');
      
      // Generate filename
      const fileName = this.generateFileName(dashboardData);
      
      // Write file
      XLSX.writeFile(workbook, fileName);
      
      onProgress?.(100, 'Export completed!');
    } catch (error) {
      console.error('Excel export error:', error);
      throw new Error(`Failed to generate Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create summary sheet with event overview
   */
  private createSummarySheet(dashboardData: DashboardResponse): XLSX.WorkSheet {
    const summaryData: ExportSummaryData = {
      event_name: dashboardData.event_name,
      event_dates: `${dashboardData.event_start_date} to ${dashboardData.event_end_date}`,
      total_participants: dashboardData.total_participants,
      total_days: dashboardData.daily_schedule.length,
      confirmed_participants: dashboardData.confirmed_participants,
      waiting_participants: dashboardData.waiting_participants,
      total_groups: dashboardData.summary.total_groups,
      group_registrations: dashboardData.summary.group_registrations,
      individual_registrations: dashboardData.summary.individual_registrations,
      public_transport: dashboardData.summary.public_transport,
      private_transport: dashboardData.summary.private_transport,
      total_empty_seats: dashboardData.summary.total_empty_seats,
      groups_with_empty_seats: dashboardData.summary.groups_with_empty_seats,
      gender_distribution: {
        male: dashboardData.summary.gender_distribution.M,
        female: dashboardData.summary.gender_distribution.F,
      },
      age_groups: dashboardData.summary.age_groups,
      city_distribution: dashboardData.summary.city_distribution,
      toilet_preferences: dashboardData.summary.toilet_preferences,
    };

    // Create summary data array
    const summaryArray = [
      ['Event Summary', ''],
      ['Event Name', summaryData.event_name],
      ['Event Dates', summaryData.event_dates],
      ['Total Participants', summaryData.total_participants],
      ['Total Days', summaryData.total_days],
      ['', ''],
      ['Registration Status', ''],
      ['Confirmed Participants', summaryData.confirmed_participants],
      ['Waiting Participants', summaryData.waiting_participants],
      ['', ''],
      ['Registration Types', ''],
      ['Total Groups', summaryData.total_groups],
      ['Group Registrations', summaryData.group_registrations],
      ['Individual Registrations', summaryData.individual_registrations],
      ['', ''],
      ['Transportation', ''],
      ['Public Transport', summaryData.public_transport],
      ['Private Transport', summaryData.private_transport],
      ['Total Empty Seats', summaryData.total_empty_seats],
      ['Groups with Empty Seats', summaryData.groups_with_empty_seats],
      ['', ''],
      ['Demographics', ''],
      ['Male Participants', summaryData.gender_distribution.male],
      ['Female Participants', summaryData.gender_distribution.female],
      ['', ''],
      ['Age Groups', ''],
      ...Object.entries(summaryData.age_groups).map(([age, count]) => [`${age} years`, count]),
      ['', ''],
      ['Toilet Preferences', ''],
      ['Indian Style', summaryData.toilet_preferences.indian],
      ['Western Style', summaryData.toilet_preferences.western],
      ['', ''],
      ['Top Cities', ''],
      ...Object.entries(summaryData.city_distribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([city, count]) => [city, count]),
    ];

    return XLSX.utils.aoa_to_sheet(summaryArray);
  }

  /**
   * Create sheet for a specific day
   */
  private createDaySheet(
    day: EventDay, 
    options: ExportOptions
  ): XLSX.WorkSheet {
    // Get selected fields
    const selectedFields = this.getSelectedFields(options.selectedFields);
    
    // Filter participants by status
    const filteredParticipants = this.filterParticipantsByStatus(day.participants, options);
    
    // Create headers
    const headers = selectedFields.map(field => field.label);
    
    // Transform participant data
    const participantData = filteredParticipants.map((participant) => {
      const rowData: Record<string, any> = {};
      
      selectedFields.forEach(field => {
        if (field.key === 'event_day') {
          rowData[field.label] = new Date(day.event_date).toLocaleDateString();
        } else if (field.key === 'location_name') {
          rowData[field.label] = day.location_name;
        } else {
          const value = participant[field.key as keyof Participant];
          rowData[field.label] = this.formatValue(value, field.key as keyof Participant);
        }
      });
      
      return rowData;
    });

    // Convert to array format for Excel
    const dataArray = [
      headers,
      ...participantData.map(row => selectedFields.map(field => row[field.label]))
    ];

    return XLSX.utils.aoa_to_sheet(dataArray);
  }

  /**
   * Get selected days based on options
   */
  private getSelectedDays(dailySchedule: EventDay[], options: ExportOptions): EventDay[] {
    if (options.selectedDays.length === 0) {
      return dailySchedule;
    }
    
    return dailySchedule.filter(day => 
      options.selectedDays.includes(day.event_day_id)
    );
  }

  /**
   * Get selected fields based on options
   */
  private getSelectedFields(selectedFieldKeys: string[]): ExportField[] {
    return EXPORT_FIELDS.filter(field => 
      selectedFieldKeys.includes(field.key) || field.required
    );
  }

  /**
   * Filter participants by status based on export options
   */
  private filterParticipantsByStatus(participants: Participant[], options: ExportOptions): Participant[] {
    return participants.filter(participant => {
      // Always include confirmed and registered participants
      if (participant.status === 'confirmed' || participant.status === 'registered') {
        return true;
      }
      
      // Include waiting participants if option is enabled
      if (participant.status === 'waiting' && options.includeWaiting) {
        return true;
      }
      
      // Include cancelled participants if option is enabled
      if (participant.status === 'cancelled' && options.includeCancelled) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Format value for Excel display
   */
  private formatValue(value: any, key: keyof Participant): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (key === 'created_at' || key === 'updated_at') {
      return new Date(value).toLocaleDateString();
    }
    
    if (key === 'gender') {
      return value === 'M' ? 'Male' : 'Female';
    }
    
    if (key === 'registration_type') {
      return value === 'group' ? 'Group' : 'Individual';
    }
    
    if (key === 'transportation_mode') {
      return value === 'private' ? 'Private' : 'Public';
    }
    
    if (key === 'toilet_preference') {
      return value === 'indian' ? 'Indian' : 'Western';
    }
    
    return String(value);
  }

  /**
   * Generate sheet name for a day
   */
  private getSheetName(day: EventDay, dayNumber: number): string {
    const date = new Date(day.event_date);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const location = day.location_name.split(' ')[0]; // First word of location
    return `Day ${dayNumber} - ${dateStr} - ${location}`;
  }

  /**
   * Generate filename for the Excel file
   */
  private generateFileName(dashboardData: DashboardResponse): string {
    const eventName = dashboardData.event_name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `${eventName}_Participants_Export_${date}.xlsx`;
  }

  /**
   * Get default export options
   */
  public getDefaultExportOptions(): ExportOptions {
    return {
      selectedFields: EXPORT_FIELDS
        .filter(field => field.required || field.category === 'basic')
        .map(field => field.key),
      selectedDays: [],
      includeSummary: true,
      includeWaiting: false,
      includeCancelled: false,
      dateRange: null,
    };
  }

  /**
   * Validate export options
   */
  public validateExportOptions(options: ExportOptions): string[] {
    const errors: string[] = [];
    
    if (options.selectedFields.length === 0) {
      errors.push('At least one field must be selected');
    }
    
    if (options.selectedDays.length === 0) {
      errors.push('At least one day must be selected');
    }
    
    return errors;
  }
}
