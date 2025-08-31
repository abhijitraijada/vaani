interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * API configuration with environment-based URL
 * Development: http://127.0.0.1:8000/api/
 * Production: Uses VITE_API_BASE_URL from Vercel env vars
 */
export const apiConfig: ApiConfig = {
  baseURL: import.meta.env.PROD 
    ? import.meta.env.VITE_API_BASE_URL 
    : 'https://prac-pad-agent-dccc5b6927b7.herokuapp.com/api',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};
