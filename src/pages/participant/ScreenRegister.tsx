import { useAppDispatch, useAppSelector } from '../../store';
import { addParticipant, removeParticipant, updateParticipant } from '../../store/registrationSlice';
import { Container, Section, Card, Stack } from '../../components/primitives/Layout';
import { Heading, Text } from '../../components/primitives/Typography';
import { RegistrationStepper } from '../../components/participant/RegistrationStepper';
import { ParticipantRegistrationForm } from '../../components/participant/ParticipantRegistrationForm';
import { Header } from '../../components/navigation/AppShell';
import { AppFooter } from '../../components/shared/AppFooter';
import { Button } from '../../components/primitives/Button';
import { useNavigate } from 'react-router-dom';

export default function ScreenRegister() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registrationDraft);

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
                <Heading className="text-2xl">Participant Registration</Heading>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Step 1 · Enter your details and add group members if any.</Text>
                <Text className="text-sm text-blue-600 dark:text-blue-600 mt-2">
                  Note: Registration is not required if you only wish to attend the Vaani program and are arranging your own meals and accommodation.
                </Text>
                <div className="mt-2 flex justify-center">
                  <RegistrationStepper steps={["Register","Preferences","Vehicle"]} current={0} />
                </div>
              </Stack>
            </Card>
          </div>

          <div className="mx-auto mt-6 max-w-3xl">
            <ParticipantRegistrationForm
              participants={draft.participants}
              onAdd={() => dispatch(addParticipant())}
              onRemove={(i) => dispatch(removeParticipant(i))}
              onChange={(i, patch) => dispatch(updateParticipant({ index: i, patch }))}
              onNext={() => nav('/participant/preferences')}
            />
          </div>
        </Container>
      </Section>
      <AppFooter />
    </>
  );
}