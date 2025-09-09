import { BaseService } from '../base.service';
import type { DashboardResponse } from './dashboard.types';
import api from '../../lib/api';

class DashboardService extends BaseService {
  constructor() {
    super('/v1/dashboard/');
  }

  async getEventDashboard(eventId: string): Promise<DashboardResponse> {
    // Call API directly since the response structure doesn't match BaseService expectations
    const response = await api.get(`/v1/dashboard/event/${eventId}`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
