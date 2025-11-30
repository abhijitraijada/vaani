import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
// Health check API disabled until further notice
// import { healthService } from '../services/endpoints/health.service';
// import { useToast } from '../components/feedback/Toast';

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
  // console.log('HealthProvider render');
  // Health check API disabled until further notice
  const [isHealthy] = useState(false);
  const [lastChecked] = useState<Date | null>(null);
  // const [isHealthy, setIsHealthy] = useState(false);
  // const [lastChecked, setLastChecked] = useState<Date | null>(null);
  // const toast = useToast();

  useEffect(() => {
    // Health check API disabled until further notice
    // console.log('HealthProvider useEffect running');
    // let cancelled = false;
    
    // const checkHealth = async () => {
    //   if (cancelled) return;
    //   // console.log('Health check starting');
    //   try {
    //     const response = await healthService.checkHealth();
    //     if (cancelled) return;
    //     const isOk = response.status === 'healthy';
    //     // console.log('Health check success, updating state');
    //     setIsHealthy(isOk);
    //     setLastChecked(new Date());
    //   } catch (error) {
    //     if (cancelled) return;
    //     // console.log('Health check failed, updating state');
    //     setIsHealthy(false);
    //     toast.error({
    //       title: 'API Connection Error',
    //       description: 'Unable to connect to the server. Some features may be unavailable.',
    //     });
    //   }
    // };

    // // Initial check
    // checkHealth();

    // // Set up periodic health checks every 5 minutes
    // const interval = setInterval(() => {
    //   if (!cancelled) checkHealth();
    // }, 5 * 60 * 1000);

    // return () => {
    //   cancelled = true;
    //   clearInterval(interval);
    // };
  }, []); // Remove toast dependency

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
