import type { ReactNode } from 'react';
import { Card, Stack } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Icon } from '../primitives/Icon';

export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode; className?: string; }) {
  return (
    <Card className={['text-center', className].filter(Boolean).join(' ')}>
      <Stack className="items-center">
        {icon ?? <Icon name="search" width={28} height={28} className="text-gray-400" />}
        <Heading className="text-lg">{title}</Heading>
        {description ? <Text className="text-sm text-gray-600 dark:text-gray-400">{description}</Text> : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </Stack>
    </Card>
  );
}


