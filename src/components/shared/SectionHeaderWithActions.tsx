import type { ReactNode } from 'react';
import { Heading, Text } from '../primitives/Typography';
import { Flex } from '../primitives/Layout';

export function SectionHeaderWithActions({ title, subtitle, actions, className }: { title: string; subtitle?: string; actions?: ReactNode; className?: string; }) {
  return (
    <Flex className={['items-center justify-between gap-3', className].filter(Boolean).join(' ')}>
      <Flex className="min-w-0 flex-col">
        <Heading className="truncate text-xl">{title}</Heading>
        {subtitle ? <Text className="truncate text-sm text-gray-600 dark:text-gray-400">{subtitle}</Text> : null}
      </Flex>
      <Flex className="shrink-0">{actions}</Flex>
    </Flex>
  );
}


