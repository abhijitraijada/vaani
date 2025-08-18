import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setDayPreferences } from '../../store/registrationSlice';
import { Container, Section, Stack, Card, Flex } from '../../components/primitives/Layout';
import { RegistrationStepper } from '../../components/participant/RegistrationStepper';
import { DailyPreferencesForm } from '../../components/participant/DailyPreferencesForm';
import { Button } from '../../components/primitives/Button';
import { Heading, Text, Link as ALink } from '../../components/primitives/Typography';
import { Header, Footer } from '../../components/navigation/AppShell';
import { useNavigate } from 'react-router-dom';

const dates = ['2025-10-31', '2025-11-01', '2025-11-02', '2025-11-03'];

export default function ScreenPreferences() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registrationDraft);
  const [step, setStep] = useState(0);
  const currentDate = dates[step];
  const dayPrefs = draft.preferencesByDate[currentDate] ?? {
    stayingWithYatra: true,
    dinnerAtHost: true,
    breakfastAtHost: true,
    lunchWithYatra: true,
    physicalLimitations: '',
    toiletPreference: undefined,
  };

  const next = () => setStep((s) => Math.min(s + 1, dates.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const done = () => nav('/participant/vehicle');

  return (
    <>
      <Header
        left={<Text className="text-base font-semibold tracking-tight">Vasundhara ni Vaani</Text>}
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
            <RegistrationStepper steps={dates.map((d) => d)} current={step} />
            <DailyPreferencesForm
              dateLabel={currentDate}
              values={dayPrefs}
              onChange={(patch) => dispatch(setDayPreferences({ date: currentDate, prefs: patch }))}
              onPrev={step === 0 ? undefined : prev}
              onNext={step < dates.length - 1 ? next : done}
            />
            <Card>
              <Flex className="justify-between">
                <Button variant="secondary" onClick={() => nav('/participant/register')}>Back</Button>
                <Button onClick={step < dates.length - 1 ? next : done}>{step < dates.length - 1 ? 'Next' : 'Continue'}</Button>
              </Flex>
            </Card>
          </div>
        </Container>
      </Section>
      <Footer>
        <Stack className="gap-2 text-center">
          <Text className="text-sm">Nachiketa Trust • Organizers of Vasundhara ni Vaani</Text>
          <Text className="text-sm">Phone: <ALink href="tel:+919876543213">+91 98765 43213</ALink> · Email: <ALink href="mailto:org1@example.com">org1@example.com</ALink></Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Vasundhara ni Vaani</Text>
        </Stack>
      </Footer>
    </>
  );
}


