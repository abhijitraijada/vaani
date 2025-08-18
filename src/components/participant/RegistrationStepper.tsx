import { Flex } from '../primitives/Layout';
import { Pill } from '../data/Indicators';

export function RegistrationStepper({
  steps,
  current,
}: {
  steps: string[];
  current: number; // 0-indexed
}) {
  return (
    <Flex className="flex-wrap items-center gap-2">
      {steps.map((label, idx) => (
        <Pill key={idx} tone={idx === current ? 'blue' : 'gray'}>
          {idx + 1}. {label}
        </Pill>
      ))}
    </Flex>
  );
}


