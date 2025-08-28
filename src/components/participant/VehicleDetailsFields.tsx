import { Card, Stack, Grid } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Field, FieldLabel, NumberInput } from '../form/Fields';
import { Switch } from '../primitives/Switch';

export type VehicleDetails = {
  hasEmptySeats: boolean;
  availableSeats?: number;
};

export function VehicleDetailsFields({
  values,
  errors = {},
  onChange,
  onBlur,
}: {
  values: VehicleDetails;
  errors?: Partial<Record<keyof VehicleDetails, string>>;
  onChange: (patch: Partial<VehicleDetails>) => void;
  onBlur?: (field: keyof VehicleDetails) => void;
}) {
  const handleToggleChange = (checked: boolean) => {
    onChange({ hasEmptySeats: checked });
    if (!checked) {
      onChange({ availableSeats: undefined });
    }
    onBlur?.('hasEmptySeats');
  };

  return (
    <Card>
      <Stack className="gap-4">
        <Heading className="text-lg">Private vehicle details</Heading>
        <Grid className="grid-cols-1 gap-4">
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel>Share empty seats</FieldLabel>
              <Switch
                checked={values.hasEmptySeats}
                onCheckedChange={handleToggleChange}
              />
            </div>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              If enabled, you agree to share your empty seats with other participants
            </Text>
          </Field>
          {values.hasEmptySeats && (
            <Field>
              <FieldLabel>Available seats</FieldLabel>
              <NumberInput 
                value={values.availableSeats} 
                onChange={(e) => onChange({ availableSeats: Number(e.target.value) })}
                onBlur={() => onBlur?.('availableSeats')}
                placeholder="Number of seats available"
                min={1}
                required
              />
              {errors.availableSeats && (
                <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors.availableSeats}</Text>
              )}
            </Field>
          )}
        </Grid>
      </Stack>
    </Card>
  );
}