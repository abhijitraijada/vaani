import { Card, Flex } from '../primitives/Layout';
import { Text, Link } from '../primitives/Typography';
import { Checkbox } from '../form/Fields';

export function TermsAgreement({
  checked,
  onChange,
  termsHref = '#',
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  termsHref?: string;
}) {
  return (
    <Card>
      <Flex className="items-center gap-2">
        <Checkbox checked={checked} onChange={(e) => onChange((e.target as HTMLInputElement).checked)} />
        <Text className="text-sm">
          I agree to the <Link href={termsHref} target="_blank" rel="noreferrer">terms and conditions</Link>
        </Text>
      </Flex>
    </Card>
  );
}


