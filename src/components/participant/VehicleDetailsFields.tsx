import { Card, Stack, Grid } from '../primitives/Layout';
import { Heading } from '../primitives/Typography';
import { Field, FieldLabel, FieldError, TextInput, NumberInput, Checkbox } from '../form/Fields';

export type VehicleDetails = {
  vehicleMake?: string;
  vehicleNumber?: string;
  hasEmptySeats?: boolean;
  availableSeats?: number;
};

export function VehicleDetailsFields({
  values,
  errors = {},
  onChange,
}: {
  values: VehicleDetails;
  errors?: Partial<Record<keyof VehicleDetails, string>>;
  onChange: (patch: Partial<VehicleDetails>) => void;
}) {
  return (
    <Card>
      <Stack className="gap-4">
        <Heading className="text-lg">Private vehicle details</Heading>
        <Grid className="grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Vehicle make/model</FieldLabel>
            <TextInput value={values.vehicleMake ?? ''} onChange={(e) => onChange({ vehicleMake: (e.target as HTMLInputElement).value })} />
            <FieldError>{errors.vehicleMake}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Vehicle number</FieldLabel>
            <TextInput value={values.vehicleNumber ?? ''} onChange={(e) => onChange({ vehicleNumber: (e.target as HTMLInputElement).value })} />
            <FieldError>{errors.vehicleNumber}</FieldError>
          </Field>
          <Field>
            <label className="flex items-center gap-2">
              <Checkbox checked={!!values.hasEmptySeats} onChange={(e) => onChange({ hasEmptySeats: (e.target as HTMLInputElement).checked })} />
              <span className="text-sm">Has empty seats to share</span>
            </label>
          </Field>
          <Field>
            <FieldLabel>Available seats</FieldLabel>
            <NumberInput value={values.availableSeats as number | undefined} onChange={(e) => onChange({ availableSeats: Number((e.target as HTMLInputElement).value) })} />
            <FieldError>{errors.availableSeats}</FieldError>
          </Field>
        </Grid>
      </Stack>
    </Card>
  );
}


