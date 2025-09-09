import { useAppDispatch } from '../../store';
import { logoutUser } from '../../store/userSlice';
import { Button } from '../primitives/Button';

interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function LogoutButton({ className, variant = 'secondary', size = 'md' }: LogoutButtonProps) {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={className}
    >
      Logout
    </Button>
  );
}
