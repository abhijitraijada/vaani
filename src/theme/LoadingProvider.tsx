import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { LoadingOverlay } from '../components/overlays/Overlays';

type LoadingContextValue = {
  show: () => void;
  hide: () => void;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function LoadingProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const value = useMemo<LoadingContextValue>(() => ({ show: () => setVisible(true), hide: () => setVisible(false) }), []);
  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay visible={visible} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}


