import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';

export function ProtectedParticipantRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { participants, preferencesByDate } = useAppSelector(state => state.registrationDraft);

  useEffect(() => {
    const currentPath = location.pathname;

    // Helper function to check if participant data is valid
    const hasValidParticipantData = () => {
      if (!participants || participants.length === 0) return false;

      return participants.every(participant =>
        participant.name.trim() !== '' &&
        participant.email.trim() !== '' &&
        participant.phone.trim() !== '' &&
        participant.city.trim() !== '' &&
        participant.age !== null && participant.age > 0 &&
        participant.gender &&
        participant.language.trim() !== ''
      );
    };

    // Helper function to check if preferences data is valid
    const hasValidPreferencesData = () => {
      if (!preferencesByDate || Object.keys(preferencesByDate).length === 0) return false;

      return Object.values(preferencesByDate).every(pref =>
        pref.attending !== null
      );
    };

    // Step validation logic
    if (currentPath === '/participant/preferences') {
      // Step 2: Must have valid participant data from step 1
      if (!hasValidParticipantData()) {
        console.log('Redirecting to register: Missing participant data');
        navigate('/participant/register');
        return;
      }
    } else if (currentPath === '/participant/vehicle') {
      // Step 3: Must have valid participant data AND preferences data
      if (!hasValidParticipantData()) {
        console.log('Redirecting to register: Missing participant data');
        navigate('/participant/register');
        return;
      }
      if (!hasValidPreferencesData()) {
        console.log('Redirecting to preferences: Missing preferences data');
        navigate('/participant/preferences');
        return;
      }
    }
    // Step 1 (/participant/register) has no prerequisites
  }, [location.pathname, participants, preferencesByDate, navigate]);

  return <>{children}</>;
}
