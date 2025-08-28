import { Card, Stack } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button, ButtonGroup } from '../primitives/Button';
import { Flex } from '../primitives/Layout';

export type TransportType = 'public' | 'private' | null;

export function TransportTypeSelector({
  value,
  onChange,
  onBlur,
  error,
  hint = 'Choose the transport type you will use during the event.',
}: {
  value: TransportType;
  onChange: (next: TransportType) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
}) {
  return (
    <Card>
      <Stack className="gap-4">
        <Heading className="text-lg">Transport type</Heading>
        <Text className="text-sm text-gray-600 dark:text-gray-400">{hint}</Text>
        <Flex className="justify-center">
          <ButtonGroup>
            <Button
              variant={value === 'public' ? 'primary' : 'secondary'}
              onClick={() => {
                onChange('public');
                onBlur?.();
              }}
            >
              Public transport
            </Button>
            <Button
              variant={value === 'private' ? 'primary' : 'secondary'}
              onClick={() => {
                onChange('private');
                onBlur?.();
              }}
            >
              Private vehicle
            </Button>
          </ButtonGroup>
        </Flex>
        {error && (
          <Text className="text-sm text-red-500 dark:text-red-500 text-center">{error}</Text>
        )}
      </Stack>
    </Card>
  );
}