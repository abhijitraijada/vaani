import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { healthService } from '../services/endpoints/health.service';

interface HealthContextType {
  isHealthy: boolean;
  lastChecked: Date | null;
}

const HealthContext = createContext<HealthContextType>({
  isHealthy: false,
  lastChecked: null,
});

export const useHealth = () => useContext(HealthContext);

interface HealthProviderProps {
  children: ReactNode;
}

export function HealthProvider({ children }: HealthProviderProps) {
  const [isHealthy, setIsHealthy] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      if (cancelled) return;
      try {
        const response = await healthService.checkHealth();
        if (cancelled) return;
        const isOk = response.status === 'healthy';
        setIsHealthy(isOk);
        setLastChecked(new Date());
      } catch (error) {
        if (cancelled) return;
        setIsHealthy(false);
        console.warn('Health check failed: Unable to connect to the server.');
      }
    };

    // Initial check
    checkHealth();

    // Set up periodic health checks every 5 minutes
    const interval = setInterval(() => {
      if (!cancelled) checkHealth();
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const contextValue = useMemo(() => ({
    isHealthy,
    lastChecked
  }), [isHealthy, lastChecked]);

  return (
    <HealthContext.Provider value={contextValue}>
      {children}
    </HealthContext.Provider>
  );
}

