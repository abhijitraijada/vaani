import { BaseService } from '../base.service';
import api from '../../lib/api';

type HealthResponse = {
  status: 'healthy' | 'unhealthy';
  message: string;
}

class HealthService extends BaseService {
  constructor() {
    super('/v1/health/');
  }

  async checkHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>(`${this.endpoint}`);
    return response.data;
  }
}

export const healthService = new HealthService();
