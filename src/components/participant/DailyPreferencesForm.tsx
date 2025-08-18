import type { FormEvent } from 'react';
import { Card, Stack, Grid } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Form, FormActions } from '../form/Form';
import { Field, FieldLabel, FieldError, Switch, Checkbox, Textarea, Select } from '../form/Fields';

export type DayPreferences = {
  stayingWithYatra: boolean;
  dinnerAtHost: boolean;
  breakfastAtHost: boolean;
  lunchWithYatra: boolean;
  physicalLimitations?: string;
  toiletPreference?: 'indian' | 'western';
};

export function DailyPreferencesForm({
  dateLabel,
  values,
  errors = {},
  onChange,
  onPrev,
  onNext,
}: {
  dateLabel: string;
  values: DayPreferences;
  errors?: Partial<Record<keyof DayPreferences, string>>;
  onChange: (patch: Partial<DayPreferences>) => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext?.();
  };

  return (
    <Card>
      <Stack className="gap-4">
        <Heading className="text-lg">Preferences for {dateLabel}</Heading>
        <Form onSubmit={handleSubmit}>
          <Grid className="grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Staying with yatra</FieldLabel>
              <Switch checked={values.stayingWithYatra} onChange={(e) => onChange({ stayingWithYatra: (e.target as HTMLInputElement).checked })} />
              <FieldError>{errors.stayingWithYatra}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Dinner at host</FieldLabel>
              <Checkbox checked={values.dinnerAtHost} onChange={(e) => onChange({ dinnerAtHost: (e.target as HTMLInputElement).checked })} />
              <FieldError>{errors.dinnerAtHost}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Breakfast at host</FieldLabel>
              <Checkbox checked={values.breakfastAtHost} onChange={(e) => onChange({ breakfastAtHost: (e.target as HTMLInputElement).checked })} />
              <FieldError>{errors.breakfastAtHost}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Lunch with yatra</FieldLabel>
              <Checkbox checked={values.lunchWithYatra} onChange={(e) => onChange({ lunchWithYatra: (e.target as HTMLInputElement).checked })} />
              <FieldError>{errors.lunchWithYatra}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Physical limitations</FieldLabel>
              <Textarea value={values.physicalLimitations ?? ''} onChange={(e) => onChange({ physicalLimitations: (e.target as HTMLTextAreaElement).value })} />
              <FieldError>{errors.physicalLimitations}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Toilet preference</FieldLabel>
              <Select value={values.toiletPreference ?? ''} onChange={(e) => onChange({ toiletPreference: (e.target as HTMLSelectElement).value as DayPreferences['toiletPreference'] })}>
                <option value="">Select</option>
                <option value="indian">Indian</option>
                <option value="western">Western</option>
              </Select>
              <FieldError>{errors.toiletPreference}</FieldError>
            </Field>
          </Grid>

          {!values.stayingWithYatra ? (
            <Text className="text-sm text-amber-700 dark:text-amber-300">Warning: Since you are not staying with the yatra, some facilities may not be available.</Text>
          ) : null}

          <FormActions>
            {onPrev ? (
              <Button type="button" variant="secondary" onClick={onPrev}>Previous</Button>
            ) : null}
            {onNext ? (
              <Button type="submit">Next</Button>
            ) : null}
          </FormActions>
        </Form>
      </Stack>
    </Card>
  );
}


