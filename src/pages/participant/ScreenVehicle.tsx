import { useAppDispatch, useAppSelector } from '../../store';
import { setTransportType, patchVehicle } from '../../store/registrationSlice';
import { Container, Section, Stack, Card } from '../../components/primitives/Layout';
import { TransportTypeSelector } from '../../components/participant/TransportTypeSelector';
import { VehicleDetailsFields } from '../../components/participant/VehicleDetailsFields';
import { Button } from '../../components/primitives/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/feedback/Toast';
import { Header, Footer } from '../../components/navigation/AppShell';
import { Heading, Text, Link as ALink } from '../../components/primitives/Typography';

export default function ScreenVehicle() {
  const nav = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registrationDraft);
  const submitting = false;

  const submit = async () => {
    const id = toast.loading({ title: 'Submitting registration...' });
    try {
      // TODO: call API with assembled payload
      await new Promise((r) => setTimeout(r, 1200));
      toast.update(id, { variant: 'success', title: 'Registration submitted!' });
      nav('/');
    } catch (e) {
      toast.update(id, { variant: 'error', title: 'Submission failed' });
    }
  };

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
                <Heading className="text-2xl">Transport & vehicle</Heading>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Step 3 · Tell us how you travel and if you can share seats.</Text>
              </Stack>
            </Card>
          </div>
          <div className="mx-auto mt-6 max-w-3xl space-y-6">
            <TransportTypeSelector value={draft.transportType} onChange={(t) => dispatch(setTransportType(t))} />
            {draft.transportType === 'private' ? (
              <VehicleDetailsFields values={draft.vehicle} onChange={(p) => dispatch(patchVehicle(p))} />
            ) : null}
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => nav('/participant/preferences')}>Back</Button>
              <Button onClick={submit} loading={submitting}>Submit</Button>
            </div>
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


