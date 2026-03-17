import { Card, Stack, Flex } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import type { SearchParticipantResponse } from '../../services/endpoints/registration.types';

interface HostAllocationResultsProps {
  result: SearchParticipantResponse;
}

export function HostAllocationResults({ result }: HostAllocationResultsProps) {
  const { members, daily_schedule } = result;

  // Map schedule for easy lookup
  const scheduleMap = daily_schedule.reduce((acc, day) => {
    acc[day.event_day_id] = day;
    return acc;
  }, {} as Record<string, typeof daily_schedule[0]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <Flex className="justify-between items-center">
                <Heading className="text-xl font-bold text-white">{member.name}</Heading>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                  {member.status}
                </div>
              </Flex>
              <Text className="text-indigo-100 text-sm mt-1">📍 {member.city || 'Location not specified'}</Text>
            </div>

            <div className="p-6">
              {!member.host_assignments || member.host_assignments.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 dark:bg-gray-900/40 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Icon name="info" className="mx-auto text-gray-400 mb-2" width={32} height={32} />
                  <Text className="text-gray-500 dark:text-gray-400 italic">No host accommodation has been allocated yet for {member.name.split(' ')[0]}.</Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">Please check back later or contact the organizers.</Text>
                </div>
              ) : (
                <div className="space-y-4">
                  <Heading className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Host Assignments</Heading>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[...member.host_assignments].sort((a, b) => {
                      const dateA = new Date(scheduleMap[a.event_day_id]?.event_date || 0).getTime();
                      const dateB = new Date(scheduleMap[b.event_day_id]?.event_date || 0).getTime();
                      return dateA - dateB;
                    }).map((assignment) => {
                      const dayInfo = scheduleMap[assignment.event_day_id];
                      return (
                        <div 
                          key={assignment.event_day_id} 
                          className="group relative bg-indigo-50/50 dark:bg-indigo-950/20 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30 hover:shadow-md transition-all duration-300"
                        >
                          <Flex className="flex-col h-full">
                            <div className="mb-3">
                              <Text className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                                {dayInfo ? formatDate(dayInfo.event_date) : 'Unknown Date'}
                              </Text>
                              <Heading className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                                {dayInfo ? dayInfo.location_name : 'Event Location'}
                              </Heading>
                            </div>

                            <Stack className="gap-3 mt-auto">
                              <div className="bg-white dark:bg-gray-900/60 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <Flex className="items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Icon name="user" width={20} height={20} />
                                  </div>
                                  <div>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">Host Name</Text>
                                    <Text className="font-bold text-gray-900 dark:text-gray-100">{assignment.host_name || 'TBD'}</Text>
                                  </div>
                                </Flex>
                              </div>

                              {assignment.host_phone && (
                                <Button
                                  variant="secondary"
                                  onClick={() => window.open(`tel:+91${assignment.host_phone}`)}
                                  className="w-full justify-start gap-3 h-12 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:border-green-800 dark:text-green-400 rounded-xl transition-all"
                                >
                                  <Icon name="phone" width={18} height={18} />
                                  <span className="font-bold">+91 {assignment.host_phone}</span>
                                </Button>
                              )}
                              
                              <div className="flex items-start gap-2 px-1">
                                <Icon name="map-pin" className="text-gray-400 shrink-0 mt-0.5" width={14} height={14} />
                                <Text className="text-xs text-gray-600 dark:text-gray-400">
                                  Stay at: {assignment.host_location || 'Not updated'}
                                </Text>
                              </div>
                            </Stack>
                          </Flex>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3">
        <Icon name="info" className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" width={20} height={20} />
        <div>
          <Text className="text-sm font-semibold text-amber-800 dark:text-amber-300">Important Instruction</Text>
          <Text className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            If you see multiple members, please note that all of them are registered under your phone number. 
            Host assignments might differ for each member based on their preferences.
          </Text>
        </div>
      </div>
    </div>
  );
}
