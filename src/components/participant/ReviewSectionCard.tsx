import type { ReactNode } from 'react';
import { Card, Stack, Divider, Flex } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';

export function ReviewSectionCard({
  title,
  items,
  onEdit,
  className,
}: {
  title: string;
  items: Array<{ label: string; value: ReactNode }>;
  onEdit?: () => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <Stack className="gap-3">
        <Flex className="items-center justify-between">
          <Heading className="text-lg">{title}</Heading>
          {onEdit ? <Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button> : null}
        </Flex>
        <Divider />
        <Stack className="gap-2">
          {items.map((item, idx) => (
            <Flex key={idx} className="items-start justify-between gap-3">
              <Text className="text-sm text-gray-600 dark:text-gray-400">{item.label}</Text>
              <div className="min-w-0 grow text-right">
                <Text className="truncate">{item.value}</Text>
              </div>
            </Flex>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}


