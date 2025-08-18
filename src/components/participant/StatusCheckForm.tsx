import { Card, Stack, Flex } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { PhoneLookupInline } from '../shared/PhoneLookupInline';

export function StatusCheckForm({
  onSearch,
  loading,
}: {
  onSearch: (phone: string) => void;
  loading?: boolean;
}) {
  return (
    <Card>
      <Stack className="gap-3">
        <Heading className="text-lg">Check registration status</Heading>
        <Text className="text-sm text-gray-600 dark:text-gray-400">Enter your phone number to look up your registration.</Text>
        <Flex>
          <PhoneLookupInline onSearch={onSearch} loading={loading} />
        </Flex>
      </Stack>
    </Card>
  );
}


