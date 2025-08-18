import { useState } from 'react';
import { Flex } from '../primitives/Layout';
import { PhoneInput } from '../form/Fields';
import { Button } from '../primitives/Button';

export function PhoneLookupInline({ onSearch, placeholder = 'Enter phone number', loading = false, className }: { onSearch: (phone: string) => void; placeholder?: string; loading?: boolean; className?: string; }) {
  const [phone, setPhone] = useState('');
  return (
    <Flex className={['items-center gap-2', className].filter(Boolean).join(' ')}>
      <PhoneInput value={phone} onChange={(e) => setPhone((e.target as HTMLInputElement).value)} placeholder={placeholder} />
      <Button size="sm" onClick={() => onSearch(phone)} loading={loading}>Search</Button>
    </Flex>
  );
}


