import { Heading, Text, Link as ALink } from '../components/primitives/Typography';
import { Button, ButtonGroup } from '../components/primitives/Button';
import { Icon } from '../components/primitives/Icon';
import { Container, Section, Card, Divider, Grid, Stack } from '../components/primitives/Layout';
import { Chip } from '../components/primitives/Badge';
import { Tooltip } from '../components/primitives/Tooltip';
import { Form, FormSection, FormActions } from '../components/form/Form';
import { Field, FieldLabel, FieldHint, FieldError, TextInput, EmailInput, NumberInput, PhoneInput, Textarea, Select, Checkbox, Radio, Switch } from '../components/form/Fields';
import { Table, THead, TBody, TR, TH, TD } from '../components/data/Table';
import { StatCard, CapacityBar } from '../components/data/Cards';
import { ListItem, UnorderedList, OrderedList } from '../components/data/Lists';
import { Pill } from '../components/data/Indicators';
import { Modal, Drawer, ConfirmDialog } from '../components/overlays/Overlays';
import { CopyToClipboard } from '../components/utils/Utilities';
import { useState } from 'react';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { useLoading } from '../theme/LoadingProvider';
import { useToast } from '../components/feedback/Toast';
import { PhoneLookupInline } from '../components/shared/PhoneLookupInline';
import { SectionHeaderWithActions } from '../components/shared/SectionHeaderWithActions';
import { EmptyState } from '../components/shared/EmptyState';
import { Banner } from '../components/shared/Banner';
import { AppFooter } from '../components/shared/AppFooter';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export default function ComponentShowcase() {
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { mode, setMode } = useTheme();
  const { show, hide } = useLoading();
  const toast = useToast();
  
  const validationSchema = yup
    .object({
      name: yup.string().min(3, 'At least 3 characters').required('Name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      age: yup
        .number()
        .typeError('Age must be a number')
        .min(1, 'Min 1')
        .max(120, 'Max 120')
        .required('Age is required'),
    })
    .required();

  type DemoForm = yup.InferType<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoForm>({ resolver: yupResolver(validationSchema), mode: 'onBlur', reValidateMode: 'onChange' });

  const onSubmit = (data: DemoForm) => {
    // eslint-disable-next-line no-console
    console.log('Demo submit', data);
  };


  return (
    <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Container>
        <Section>
          <Heading className="text-3xl">Components Showcase</Heading>
          <Text className="mt-1">Preview of primitives and composite components with variants.</Text>
        </Section>

        <Section>
          <Heading className="text-2xl">Typography</Heading>
          <Divider />
          <Stack>
            <Heading className="text-3xl">Heading 3xl</Heading>
            <Text>Body text gray.</Text>
            <ALink href="#">Inline link</ALink>
          </Stack>
        </Section>

        <Section>
          <Heading className="text-2xl">Buttons</Heading>
          <Divider />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="icon"><Icon name="search" /></Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button
              variant="secondary"
              loading={btnLoading}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 1200);
              }}
            >
              Simulate Save
            </Button>
            <ButtonGroup>
              <Button variant="secondary">Left</Button>
              <Button variant="secondary">Middle</Button>
              <Button variant="secondary">Right</Button>
            </ButtonGroup>
            <div className="ml-auto flex items-center gap-2">
              <Text className="text-sm">Theme</Text>
              <select
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
                value={mode}
                onChange={(e) => setMode(e.target.value as ThemeMode)}
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </Section>

        <Section>
          <Heading className="text-2xl">Layout & Surfaces</Heading>
          <Divider />
          <Grid className="grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <Heading className="text-xl">Card</Heading>
              <Text>Simple card content.</Text>
              <Divider />
              <Chip>Default chip</Chip>
            </Card>
            <Card>
              <StatCard label="Participants" value={245} />
              <div className="mt-3"><CapacityBar used={180} total={245} /></div>
            </Card>
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="gray">Neutral</Pill>
                <Pill tone="blue">Info</Pill>
                <Pill tone="green">Success</Pill>
                <Pill tone="yellow">Warning</Pill>
                <Pill tone="red">Danger</Pill>
                <Pill tone="purple">Transport</Pill>
              </div>
            </Card>
          </Grid>
        </Section>

        <Section>
          <Heading className="text-2xl">Form Fields</Heading>
          <Divider />
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormSection title="Inputs" description="Common field variants">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <TextInput placeholder="John Doe" />
                <FieldHint>Full name as per ID</FieldHint>
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <EmailInput placeholder="john@example.com" />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <PhoneInput placeholder="+91-9876543210" />
              </Field>
              <Field>
                <FieldLabel>Age</FieldLabel>
                <NumberInput placeholder="28" />
              </Field>
              <Field>
                <FieldLabel>City</FieldLabel>
                <Select>
                  <option>Mumbai</option>
                  <option>Pune</option>
                </Select>
              </Field>
              <Field>
                <FieldLabel>About</FieldLabel>
                <Textarea placeholder="Write something..." />
              </Field>
              <Field>
                <FieldLabel>Accept Terms</FieldLabel>
                <div className="flex items-center gap-2"><Checkbox /> <Text className="text-sm">I agree</Text></div>
              </Field>
              <Field>
                <FieldLabel>Gender</FieldLabel>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2"><Radio name="g" /> Male</label>
                  <label className="flex items-center gap-2"><Radio name="g" /> Female</label>
                </div>
              </Field>
              <Field>
                <FieldLabel>Notifications</FieldLabel>
                <Switch />
              </Field>
            </FormSection>
            <FormActions>
              <Button type="submit">Submit</Button>
            </FormActions>
          </Form>
        </Section>

        <Section>
          <Heading className="text-2xl">Validation (React Hook Form + Yup)</Heading>
          <Divider />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <TextInput {...register('name')} aria-invalid={!!errors.name} />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <EmailInput {...register('email')} aria-invalid={!!errors.email} />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Age</FieldLabel>
                <NumberInput {...register('age')} aria-invalid={!!errors.age} />
                <FieldError>{errors.age?.message}</FieldError>
              </Field>
            </div>
            <FormActions>
              <Button type="submit">Validate</Button>
            </FormActions>
          </Form>
        </Section>

        <Section>
          <Heading className="text-2xl">Tables & Lists</Heading>
          <Divider />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>City</TH>
                </TR>
              </THead>
              <TBody>
                <TR>
                  <TD>John Doe</TD>
                  <TD>Mumbai</TD>
                </TR>
                <TR>
                  <TD>Priya</TD>
                  <TD>Pune</TD>
                </TR>
              </TBody>
            </Table>
            <Card>
              <Stack>
                <Heading className="text-lg">Unordered (with icon)</Heading>
                <UnorderedList>
                  <ListItem>First point</ListItem>
                  <ListItem>Second point</ListItem>
                  <ListItem>Third point</ListItem>
                </UnorderedList>
                <Divider />
                <Heading className="text-lg">Ordered (Upper Roman)</Heading>
                <OrderedList variant="upper-roman" start={1}>
                  <li>Prerequisite</li>
                  <li>Installation</li>
                  <li>Verification</li>
                </OrderedList>
                <Divider />
                <Heading className="text-lg">Unordered (arrow icon)</Heading>
                <UnorderedList bullet={<Icon name="arrow-right" width={14} height={14} className="text-gray-400" /> }>
                  <ListItem>Navigate to the components page</ListItem>
                  <ListItem>Select a component</ListItem>
                  <ListItem>Review its variants</ListItem>
                </UnorderedList>
              </Stack>
            </Card>
          </div>
        </Section>

        <Section>
          <Heading className="text-2xl">Overlays & Feedback</Heading>
          <Divider />
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setOpenDrawer(true)}>Open Drawer</Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Confirm</Button>
            <Button onClick={() => { show(); setTimeout(() => hide(), 1200); }}>Global Loading Overlay</Button>
            <Button onClick={() => toast.success({ title: 'Saved', description: 'Changes have been saved.' })}>Toast Success</Button>
            <Button variant="secondary" onClick={() => toast.error({ title: 'Failed', description: 'Something went wrong.' })}>Toast Error</Button>
            <Button variant="ghost" onClick={() => toast.info({ title: 'Heads up', description: 'Informational message.' })}>Toast Info</Button>
            <Button variant="secondary" onClick={() => toast.warning({ title: 'Warning', description: 'Be careful.' })}>Toast Warning</Button>
            <Button onClick={() => {
              const id = toast.loading({ title: 'Uploading', description: 'Please wait...', durationMs: 0 });
              setTimeout(() => {
                // Convert existing loading toast into success
                toast.update(id, { variant: 'success', title: 'Done', description: 'Upload complete.', durationMs: 3000 });
              }, 1500);
            }}>Toast Loading</Button>
            <Tooltip label="Tooltip content"><Button variant="ghost">Hover me</Button></Tooltip>
            <CopyToClipboard text="npm i react-router-dom" buttonLabel="Copy" />
          </div>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Heading className="text-xl">Modal Title</Heading>
            <Text className="mt-2">This is a basic modal.</Text>
            <div className="mt-4 text-right"><Button onClick={() => setOpenModal(false)}>Close</Button></div>
          </Modal>
          <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
            <Heading className="text-xl">Drawer</Heading>
            <Text className="mt-2">Slide-over panel content.</Text>
          </Drawer>
          <ConfirmDialog open={confirmOpen} title="Are you sure?" message="This action cannot be undone." onCancel={() => setConfirmOpen(false)} onConfirm={() => setConfirmOpen(false)} />
        </Section>

        <Section>
          <Heading className="text-2xl">Shared Composites</Heading>
          <Divider />
          <Stack>
            <SectionHeaderWithActions
              title="Participants"
              subtitle="Manage all participants"
              actions={<Button onClick={() => console.log('Add clicked')}>Add</Button>}
            />
            <PhoneLookupInline onSearch={(phone) => console.log('Lookup phone:', phone)} />
            <Banner title="Draft saved" description="Your changes were auto-saved." onClose={() => console.log('Banner close')} />
            <EmptyState title="No results" description="Try adjusting your filters." action={<Button onClick={() => console.log('Reset filters')}>Reset filters</Button>} />
          </Stack>
        </Section>
      </Container>
      <AppFooter />
    </div>
  );
}


