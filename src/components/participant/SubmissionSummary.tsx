import { Card, Stack, Flex } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';

export function SubmissionSummary({
  title = 'Review and submit',
  subtitle,
  onSubmit,
  submitting = false,
}: {
  title?: string;
  subtitle?: string;
  onSubmit: () => void;
  submitting?: boolean;
}) {
  return (
    <Card>
      <Stack className="gap-3">
        <Heading className="text-lg">{title}</Heading>
        {subtitle ? <Text className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</Text> : null}
        <Flex className="justify-end">
          <Button onClick={onSubmit} loading={submitting}>Submit</Button>
        </Flex>
      </Stack>
    </Card>
  );
}


