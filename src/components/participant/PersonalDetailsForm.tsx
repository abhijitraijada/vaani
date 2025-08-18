import type { FormEvent } from 'react';
import { Card, Stack, Grid } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Form, FormActions } from '../form/Form';
import { Field, FieldLabel, FieldError, TextInput, EmailInput, PhoneInput, NumberInput, Select } from '../form/Fields';

export type PersonalDetailsValues = {
  name: string;
  email: string;
  phone: string;
  city: string;
  age?: number;
  floor?: 'ground' | 'first' | 'second' | 'higher';
  language?: string;
};

export function PersonalDetailsForm({
  values,
  errors = {},
  onChange,
  onSubmit,
  onBack,
}: {
  values: PersonalDetailsValues;
  errors?: Partial<Record<keyof PersonalDetailsValues, string>>;
  onChange: (patch: Partial<PersonalDetailsValues>) => void;
  onSubmit: () => void;
  onBack?: () => void;
}) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <Stack className="gap-4">
        <Heading className="text-lg">Personal details</Heading>
        <Text className="text-sm text-gray-600 dark:text-gray-400">Provide your contact and basic information.</Text>

        <Form onSubmit={handleSubmit}>
          <Grid className="grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <TextInput
                value={values.name}
                onChange={(e) => onChange({ name: (e.target as HTMLInputElement).value })}
                placeholder="John Doe"
                aria-invalid={!!errors.name}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <EmailInput
                value={values.email}
                onChange={(e) => onChange({ email: (e.target as HTMLInputElement).value })}
                placeholder="john@example.com"
                aria-invalid={!!errors.email}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <PhoneInput
                value={values.phone}
                onChange={(e) => onChange({ phone: (e.target as HTMLInputElement).value })}
                placeholder="+91-9876543210"
                aria-invalid={!!errors.phone}
              />
              <FieldError>{errors.phone}</FieldError>
            </Field>

            <Field>
              <FieldLabel>City</FieldLabel>
              <TextInput
                value={values.city}
                onChange={(e) => onChange({ city: (e.target as HTMLInputElement).value })}
                placeholder="Mumbai"
                aria-invalid={!!errors.city}
              />
              <FieldError>{errors.city}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Age</FieldLabel>
              <NumberInput
                value={values.age as number | undefined}
                onChange={(e) => onChange({ age: Number((e.target as HTMLInputElement).value) })}
                placeholder="28"
                aria-invalid={!!errors.age}
              />
              <FieldError>{errors.age}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Preferred floor</FieldLabel>
              <Select
                value={values.floor}
                onChange={(e) => onChange({ floor: (e.target as HTMLSelectElement).value as PersonalDetailsValues['floor'] })}
                aria-invalid={!!errors.floor}
              >
                <option value="">Select</option>
                <option value="ground">Ground</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="higher">Higher</option>
              </Select>
              <FieldError>{errors.floor}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Preferred language</FieldLabel>
              <TextInput
                value={values.language ?? ''}
                onChange={(e) => onChange({ language: (e.target as HTMLInputElement).value })}
                placeholder="English"
                aria-invalid={!!errors.language}
              />
              <FieldError>{errors.language}</FieldError>
            </Field>
          </Grid>

          <FormActions>
            {onBack ? (
              <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
            ) : null}
            <Button type="submit">Next</Button>
          </FormActions>
        </Form>
      </Stack>
    </Card>
  );
}


