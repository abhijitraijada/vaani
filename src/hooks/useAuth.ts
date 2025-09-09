import { useAppSelector } from '../store';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading } = useAppSelector((state) => state.user);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
  };
}
