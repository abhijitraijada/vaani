import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { setUserFromStorage } from '../store/userSlice';

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize user state from localStorage on app startup
    dispatch(setUserFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}
