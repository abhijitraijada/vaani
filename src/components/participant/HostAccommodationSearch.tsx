import { Card, Stack, Flex } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { PhoneLookupInline } from '../shared/PhoneLookupInline';
import { Icon } from '../primitives/Icon';

interface HostAccommodationSearchProps {
  onSearch: (phone: string) => void;
  loading?: boolean;
}

export function HostAccommodationSearch({ onSearch, loading }: HostAccommodationSearchProps) {
  return (
    <Card className="relative overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-950/40 backdrop-blur-md">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <Stack className="gap-6 p-2 md:p-4 items-center text-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
          <Icon name="home" className="text-white" width={32} height={32} />
        </div>

        <Stack className="gap-2">
          <Heading className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Check Your Accommodation
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Enter your registered phone number to find out where you'll be staying and who to contact.
          </Text>
        </Stack>

        <div className="w-full max-w-md p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <Flex className="justify-center">
            <PhoneLookupInline
              onSearch={onSearch}
              loading={loading}
              placeholder="##########"
              className="w-full"
            />
          </Flex>
          <Text className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mt-4 text-center">
            Search by phone number only
          </Text>
        </div>

        <Stack className="gap-3 w-full">
          <Flex className="items-center justify-center gap-6 py-2 border-t border-gray-100 dark:border-gray-800 w-full mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">Host Contact</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">Stay Location</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily Schedule</Text>
            </div>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  );
}
