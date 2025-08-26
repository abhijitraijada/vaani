import type { PropsWithChildren } from 'react';
import { Card, Stack, Flex } from '../primitives/Layout';
import { Text, Heading } from '../primitives/Typography';
import { Button, ButtonGroup } from '../primitives/Button';

export type RegistrationType = 'individual' | 'group';

export function RegistrationTypeSelector({
  value,
  onChange,
  onNext,
  title = 'Select registration type',
  hint = 'Choose whether you want to register as an individual or a group.',
  nextLabel = 'Next',
}: PropsWithChildren<{
  value: RegistrationType;
  onChange: (next: RegistrationType) => void;
  onNext?: () => void;
  title?: string;
  hint?: string;
  nextLabel?: string;
}>) {
  return (
    <Card>
      <Stack className="gap-4">
        <Heading className="text-lg">{title}</Heading>
        <Text className="text-sm text-gray-600 dark:text-gray-400">{hint}</Text>
        <Flex className="justify-center">
          <ButtonGroup>
            <Button
              variant={value === 'individual' ? 'primary' : 'secondary'}
              onClick={() => onChange('individual')}
            >
              Individual
            </Button>
            <Button
              variant={value === 'group' ? 'primary' : 'secondary'}
              onClick={() => onChange('group')}
            >
              Group
            </Button>
          </ButtonGroup>
        </Flex>
        {onNext ? (
          <Flex className="justify-end">
            <Button onClick={onNext}>{nextLabel}</Button>
          </Flex>
        ) : null}
      </Stack>
    </Card>
  );
}


