import api from '../lib/api';
import type { ApiResponse, ErrorResponse } from './api.types';
import type { AxiosResponse } from 'axios';

export class BaseService {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  protected async get<T>(path: string = ''): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.get(`${this.endpoint}${path}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  protected async post<T>(path: string = '', data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.post(`${this.endpoint}${path}`, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  protected async put<T>(path: string = '', data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.put(`${this.endpoint}${path}`, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  protected async delete<T>(path: string = ''): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.delete(`${this.endpoint}${path}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  protected handleError(error: any): never {
    const errorResponse: ErrorResponse = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
    throw errorResponse;
  }
}
