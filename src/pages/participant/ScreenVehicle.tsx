import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setTransportType, patchVehicle, resetDraft } from '../../store/registrationSlice';
import { Container, Section, Stack, Card } from '../../components/primitives/Layout';
import { TransportTypeSelector } from '../../components/participant/TransportTypeSelector';
import { VehicleDetailsFields } from '../../components/participant/VehicleDetailsFields';
import { Button } from '../../components/primitives/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/feedback/Toast';
import { Header } from '../../components/navigation/AppShell';
import { AppFooter } from '../../components/shared/AppFooter';
import { Heading, Text } from '../../components/primitives/Typography';
import { registrationService } from '../../services/endpoints/registration.service';
import type { RegistrationMember, DailyPreference } from '../../services/endpoints/registration.types';

type ValidationErrors = {
  transportType?: string;
  availableSeats?: string;
};

export default function ScreenVehicle() {
  const nav = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registrationDraft);
  const { activeEvent } = useAppSelector(state => state.events);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateTransportType = () => {
    if (!draft.transportType) {
      setErrors(prev => ({ ...prev, transportType: 'Please select a transport type' }));
      return false;
    }
    setErrors(prev => ({ ...prev, transportType: undefined }));
    return true;
  };

  const validateVehicleDetails = () => {
    if (draft.transportType === 'private' && draft.vehicle.hasEmptySeats) {
      if (!draft.vehicle.availableSeats || draft.vehicle.availableSeats <= 0) {
        setErrors(prev => ({ ...prev, availableSeats: 'Please enter a valid number of available seats' }));
        return false;
      }
    }
    setErrors(prev => ({ ...prev, availableSeats: undefined }));
    return true;
  };

  const validateAll = () => {
    const isTransportValid = validateTransportType();
    const isVehicleValid = validateVehicleDetails();
    return isTransportValid && isVehicleValid;
  };

  const submit = async () => {
    if (!validateAll()) {
      return;
    }

    const id = toast.loading({ title: 'Submitting registration...' });
    setSubmitting(true);
    try {
      // Transform participants to API member format
      const members: RegistrationMember[] = draft.participants.map(participant => ({
        name: participant.name,
        phone_number: participant.phone,
        email: participant.email,
        city: participant.city,
        age: participant.age || 0,
        gender: participant.gender || 'M',
        language: participant.language,
        floor_preference: (participant.age && participant.age >= 70) ? 'Ground' : 'Any',
        status: 'registered'
      }));

      // Transform daily preferences
      const dailyPreferences: DailyPreference[] = Object.entries(draft.preferencesByDate)
        .filter(([_, prefs]) => prefs.attending === true) // Only include days where attending is true
        .map(([date, prefs]) => {
          const eventDay = activeEvent!.event_days.find(day => day.event_date === date);
          return {
            event_day_id: eventDay!.id,
            staying_with_yatra: prefs.stayingWithYatra,
            dinner_at_host: prefs.dinnerAtHost,
            breakfast_at_host: prefs.breakfastAtHost,
            lunch_with_yatra: prefs.lunchWithYatra,
            physical_limitations: prefs.physicalLimitations || undefined,
            toilet_preference: prefs.toiletPreference
          };
        });

      await registrationService.register({
        event_id: activeEvent!.id,
        registration_type: draft.participants.length > 1 ? 'group' : 'individual',
        number_of_members: draft.participants.length,
        transportation_mode: draft.transportType!,
        has_empty_seats: draft.vehicle.hasEmptySeats || false,
        available_seats_count: draft.vehicle.availableSeats,
        members,
        daily_preferences: dailyPreferences
      });

      toast.update(id, { variant: 'success', title: 'Registration submitted!' });
      dispatch(resetDraft()); // Reset the form after successful submission
      nav('/');
    } catch (e) {
      console.error('Registration failed:', e);
      toast.update(id, { 
        variant: 'error', 
        title: 'Registration failed',
        description: 'Please try again or contact support if the issue persists.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header
        left={<Text className="font-semibold tracking-tight text-4xl">Vasundhara ni Vaani</Text>}
        right={<Button variant="secondary" onClick={() => nav('/')}>Home</Button>}
      />
      <Section className="pt-0">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Card>
              <Stack className="gap-2 text-center">
                <Heading className="text-2xl">Transport & vehicle</Heading>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Step 3 · Tell us how you travel and if you can share seats.</Text>
              </Stack>
            </Card>
          </div>
          <div className="mx-auto mt-6 max-w-3xl space-y-6">
            <TransportTypeSelector 
              value={draft.transportType} 
              onChange={(t) => dispatch(setTransportType(t))}
              onBlur={validateTransportType}
              error={errors.transportType}
            />
            {draft.transportType === 'private' ? (
              <VehicleDetailsFields 
                values={draft.vehicle} 
                onChange={(p) => dispatch(patchVehicle(p))}
                onBlur={validateVehicleDetails}
                errors={{ availableSeats: errors.availableSeats }}
              />
            ) : null}
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => nav('/participant/preferences')}>Back</Button>
              <Button onClick={submit} loading={submitting}>Submit</Button>
            </div>
          </div>
        </Container>
      </Section>
      <AppFooter />
    </>
  );
}