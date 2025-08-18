import { Card, Stack } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button, ButtonGroup } from '../primitives/Button';

export type TransportType = 'public' | 'private';

export function TransportTypeSelector({
  value,
  onChange,
  hint = 'Choose the transport type you will use during the event.',
}: {
  value: TransportType;
  onChange: (next: TransportType) => void;
  hint?: string;
}) {
  return (
    <Card>
      <Stack className="gap-4">
        <Heading className="text-lg">Transport type</Heading>
        <Text className="text-sm text-gray-600 dark:text-gray-400">{hint}</Text>
        <ButtonGroup>
          <Button
            variant={value === 'public' ? 'primary' : 'secondary'}
            onClick={() => onChange('public')}
          >
            Public transport
          </Button>
          <Button
            variant={value === 'private' ? 'primary' : 'secondary'}
            onClick={() => onChange('private')}
          >
            Private vehicle
          </Button>
        </ButtonGroup>
      </Stack>
    </Card>
  );
}


