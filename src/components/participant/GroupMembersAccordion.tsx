import { useState } from 'react';
import { Card, Stack, Flex, Grid } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Field, FieldLabel, TextInput, EmailInput, PhoneInput, NumberInput, Select } from '../form/Fields';

export type GroupMember = {
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  age?: number;
  floor?: 'ground' | 'first' | 'second' | 'higher';
  language?: string;
};

export function GroupMembersAccordion({
  members,
  onChange,
  onAdd,
  onRemove,
}: {
  members: GroupMember[];
  onChange: (index: number, patch: Partial<GroupMember>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Card>
      <Stack className="gap-4">
        <Flex className="items-center justify-between">
          <Heading className="text-lg">Group members</Heading>
          <Button variant="secondary" onClick={onAdd}>Add member</Button>
        </Flex>
        <Stack className="gap-3">
          {members.map((m, idx) => (
            <div key={idx}>
              <Button
                variant={openIndex === idx ? 'primary' : 'secondary'}
                className="w-full justify-between"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="truncate text-left">Member {idx + 1}: {m.name || 'Unnamed'}</span>
                <span className="opacity-70">{openIndex === idx ? '−' : '+'}</span>
              </Button>
              {openIndex === idx ? (
                <Card className="mt-2">
                  <Stack>
                    <Grid className="grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Name</FieldLabel>
                        <TextInput value={m.name} onChange={(e) => onChange(idx, { name: (e.target as HTMLInputElement).value })} />
                      </Field>
                      <Field>
                        <FieldLabel>Email</FieldLabel>
                        <EmailInput value={m.email ?? ''} onChange={(e) => onChange(idx, { email: (e.target as HTMLInputElement).value })} />
                      </Field>
                      <Field>
                        <FieldLabel>Phone</FieldLabel>
                        <PhoneInput value={m.phone ?? ''} onChange={(e) => onChange(idx, { phone: (e.target as HTMLInputElement).value })} />
                      </Field>
                      <Field>
                        <FieldLabel>City</FieldLabel>
                        <TextInput value={m.city ?? ''} onChange={(e) => onChange(idx, { city: (e.target as HTMLInputElement).value })} />
                      </Field>
                      <Field>
                        <FieldLabel>Age</FieldLabel>
                        <NumberInput value={m.age as number | undefined} onChange={(e) => onChange(idx, { age: Number((e.target as HTMLInputElement).value) })} />
                      </Field>
                      <Field>
                        <FieldLabel>Preferred floor</FieldLabel>
                        <Select value={m.floor ?? ''} onChange={(e) => onChange(idx, { floor: (e.target as HTMLSelectElement).value as GroupMember['floor'] })}>
                          <option value="">Select</option>
                          <option value="ground">Ground</option>
                          <option value="first">First</option>
                          <option value="second">Second</option>
                          <option value="higher">Higher</option>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>Preferred language</FieldLabel>
                        <TextInput value={m.language ?? ''} onChange={(e) => onChange(idx, { language: (e.target as HTMLInputElement).value })} />
                      </Field>
                    </Grid>
                    <Flex className="justify-end gap-2">
                      <Button variant="destructive" onClick={() => onRemove(idx)}>Remove</Button>
                    </Flex>
                  </Stack>
                </Card>
              ) : null}
            </div>
          ))}
          {members.length === 0 ? (
            <Text className="text-sm text-gray-600 dark:text-gray-400">No members added yet.</Text>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
}


