interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * API configuration with environment-based URL
 * Uses VITE_API_BASE_URL if set (from .env.local or Vercel env vars)
 * Falls back to localhost for local development
 */
export const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

