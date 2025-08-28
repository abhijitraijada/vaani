import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setDayPreferences } from '../../store/registrationSlice';
import { Container, Section, Stack, Card} from '../../components/primitives/Layout';
import { RegistrationStepper } from '../../components/participant/RegistrationStepper';
import { DailyPreferencesForm } from '../../components/participant/DailyPreferencesForm';
import { Button } from '../../components/primitives/Button';
import { Heading, Text } from '../../components/primitives/Typography';
import { Header } from '../../components/navigation/AppShell';
import { AppFooter } from '../../components/shared/AppFooter';
import { useNavigate } from 'react-router-dom';

// Function to format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function ScreenPreferences() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registrationDraft);
  const { activeEvent } = useAppSelector(state => state.events);
  
  // Sort event days chronologically
  // We know activeEvent is not null because of ProtectedParticipantRoute
  const eventDays = [...activeEvent!.event_days].sort((a, b) => 
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  ) || [];
  const [step, setStep] = useState(0);
  const currentDay = eventDays[step];
  const currentDate = currentDay?.event_date;
  const dayPrefs = draft.preferencesByDate[currentDate] ?? {
    attending: null,
    stayingWithYatra: false,
    dinnerAtHost: false,
    breakfastAtHost: false,
    lunchWithYatra: false,
    physicalLimitations: '',
    toiletPreference: null,
  };

  const next = () => setStep((s) => Math.min(s + 1, eventDays.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const done = () => nav('/participant/vehicle');


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
                <Heading className="text-2xl">Daily preferences</Heading>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Step 2 · Tell us your plan for each day.</Text>
                <div className="mt-2 flex justify-center"><RegistrationStepper steps={["Register","Preferences","Vehicle"]} current={1} /></div>
              </Stack>
            </Card>
          </div>

          <div className="mx-auto mt-6 max-w-3xl space-y-6">
            <RegistrationStepper 
              steps={eventDays.map(day => `${formatDate(day.event_date)}`)} 
              current={step} 
            />
            <DailyPreferencesForm
              dateLabel={currentDate ? `${formatDate(currentDate)}` : ''}
              dayConfig={{
                breakfast_provided: currentDay.breakfast_provided,
                lunch_provided: currentDay.lunch_provided,
                dinner_provided: currentDay.dinner_provided,
                daily_notes: currentDay.daily_notes,
                location_name: currentDay.location_name,
              }}
              values={dayPrefs}
              onChange={(patch) => dispatch(setDayPreferences({ date: currentDate, prefs: patch }))}
              onPrev={step === 0 ? undefined : prev}
              onNext={step < eventDays.length - 1 ? next : done}
              backToRegister={() => nav('/participant/register')}
            />
          </div>
        </Container>
      </Section>
      <AppFooter />
    </>
  );
}


