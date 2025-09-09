import { BaseService } from '../base.service';
import type { LoginRequest, LoginResponse } from './auth.types';
import api from '../../lib/api';

class AuthService extends BaseService {
  constructor() {
    super('/v1/users/');
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Call API directly since the response structure doesn't match BaseService expectations
    const response = await api.post('/v1/users/login', credentials);
    return response.data;
  }
}

export const authService = new AuthService();
