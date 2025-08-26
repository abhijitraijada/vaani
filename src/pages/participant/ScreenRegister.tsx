import { useAppDispatch, useAppSelector } from '../../store';
import { setRegistrationType, patchPersonal, addGroupMember, removeGroupMember, patchGroupMember } from '../../store/registrationSlice';
import { Container, Section, Stack, Card } from '../../components/primitives/Layout';
import { RegistrationTypeSelector } from '../../components/participant/RegistrationTypeSelector';
import { PersonalDetailsForm } from '../../components/participant/PersonalDetailsForm';
import { GroupMembersAccordion } from '../../components/participant/GroupMembersAccordion';
import { RegistrationStepper } from '../../components/participant/RegistrationStepper';
import { Heading, Text, Link as ALink } from '../../components/primitives/Typography';
import { Header, Footer } from '../../components/navigation/AppShell';
import { Button } from '../../components/primitives/Button';
import { useNavigate } from 'react-router-dom';

export default function ScreenRegister() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.registrationDraft);

  return (
    <>
      <Header
        left={<Text className="text-4xl font-semibold tracking-tight">Vasundhara ni Vaani</Text>}
        right={<Button variant="secondary" onClick={() => nav('/')}>Home</Button>}
      />

      <Section className="pt-0">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Card>
              <Stack className="gap-2 text-center">
                <Heading className="text-2xl">Register for the Yatra</Heading>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Step 1 · Choose type and share your personal details.</Text>
                <div className="mt-2 flex justify-center"><RegistrationStepper steps={["Register","Preferences","Vehicle"]} current={0} /></div>
              </Stack>
            </Card>
          </div>

          <div className="mx-auto mt-6 max-w-3xl space-y-6">
            <RegistrationTypeSelector
              value={draft.registrationType}
              onChange={(t) => dispatch(setRegistrationType(t))}
            />

            <PersonalDetailsForm
              values={draft.personal}
              onChange={(p) => dispatch(patchPersonal(p))}
              onSubmit={() => nav('/participant/preferences')}
            />

            {draft.registrationType === 'group' ? (
              <GroupMembersAccordion
                members={draft.group}
                onAdd={() => dispatch(addGroupMember())}
                onRemove={(i) => dispatch(removeGroupMember(i))}
                onChange={(i, patch) => dispatch(patchGroupMember({ index: i, patch }))}
              />
            ) : null}
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


