import { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { RegistrationCountdown } from './RegistrationCountdown';

// Registration opens on 15th January 2026 at 9:00 AM IST
const REGISTRATION_START = new Date('2026-01-15T09:00:00+05:30');

interface RegistrationGateProps {
    children: React.ReactNode;
}

export function RegistrationGate({ children }: RegistrationGateProps) {
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkIfOpen = () => {
            const now = new Date();
            setIsOpen(now >= REGISTRATION_START);
        };

        // Check immediately
        checkIfOpen();

        // Check every second to update when registration opens
        const timer = setInterval(checkIfOpen, 1000);

        return () => clearInterval(timer);
    }, []);

    // Logged-in admins bypass the gate
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // If registration is open, show the content
    if (isOpen) {
        return <>{children}</>;
    }

    // Registration not yet open - show countdown
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full">
                <RegistrationCountdown startTime={REGISTRATION_START} />
            </div>
        </div>
    );
}

// Export the registration start time for use in other components
export { REGISTRATION_START };
