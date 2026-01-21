import type { SearchParticipantResponse } from '../../services/endpoints/registration.types';
import { Card, Stack } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';

interface SearchResultModalProps {
    result: SearchParticipantResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function SearchResultModal({ result, isOpen, onClose }: SearchResultModalProps) {
    const { isMobile } = useMediaQuery();

    if (!isOpen || !result) return null;

    const member = result.members[0]; // Primary searched member

    // Sort daily schedule by date
    const sortedSchedule = [...result.daily_schedule].sort(
        (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'registered': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'waiting': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getGenderLabel = (gender: string) => {
        switch (gender) {
            case 'M': return 'Male';
            case 'F': return 'Female';
            default: return 'Other';
        }
    };

    return (
        <div className={cn(
            'fixed inset-0 bg-black bg-opacity-50 z-50',
            isMobile ? 'flex flex-col' : 'flex items-center justify-center p-4'
        )}>
            <div className={cn(
                'bg-white dark:bg-gray-800 w-full overflow-hidden',
                isMobile
                    ? 'h-full flex flex-col'
                    : 'rounded-lg max-w-3xl max-h-[90vh]'
            )}>
                {/* Header */}
                <div className={cn(
                    'flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700',
                    isMobile && 'sticky top-0 z-10 bg-white dark:bg-gray-800'
                )}>
                    <div>
                        <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Registration Details
                        </Heading>
                        <div className="flex items-center gap-2 mt-1">
                            <Text className="text-gray-600 dark:text-gray-400">
                                {member.name}
                            </Text>
                            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', getStatusColor(member.status))}>
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={onClose}
                        className="w-8 h-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <Icon name="x" width={20} height={20} />
                    </Button>
                </div>

                {/* Content */}
                <div className={cn(
                    'overflow-y-auto',
                    isMobile ? 'flex-1 p-4' : 'p-6 max-h-[70vh]'
                )}>
                    <Stack className="gap-4 md:gap-6">
                        {/* Personal Information */}
                        <Card className="p-4">
                            <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Personal Information
                            </Heading>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</Text>
                                    <Text className="text-gray-900 dark:text-gray-100">+91 {member.phone_number}</Text>
                                </div>
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</Text>
                                    <Text className="text-gray-900 dark:text-gray-100">{member.email || '-'}</Text>
                                </div>
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">City</Text>
                                    <Text className="text-gray-900 dark:text-gray-100">{member.city || '-'}</Text>
                                </div>
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</Text>
                                    <Text className="text-gray-900 dark:text-gray-100">{member.age || '-'}</Text>
                                </div>
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</Text>
                                    <Text className="text-gray-900 dark:text-gray-100">{getGenderLabel(member.gender)}</Text>
                                </div>
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</Text>
                                    <Text className="text-gray-900 dark:text-gray-100">{member.language || '-'}</Text>
                                </div>
                            </div>
                        </Card>

                        {/* Group Members (if group registration) */}
                        {result.registration_type === 'group' && result.members.length > 1 && (
                            <Card className="p-4">
                                <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Group Members ({result.members.length})
                                </Heading>
                                <div className="space-y-2">
                                    {result.members.map((m) => (
                                        <div key={m.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div>
                                                <Text className="font-medium text-gray-900 dark:text-gray-100">{m.name}</Text>
                                                <Text className="text-sm text-gray-500 dark:text-gray-400">{m.city}</Text>
                                            </div>
                                            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', getStatusColor(m.status))}>
                                                {m.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Transportation */}
                        <Card className="p-4">
                            <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Transportation
                            </Heading>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Mode</Text>
                                    <Text className="text-gray-900 dark:text-gray-100 capitalize">{result.transportation_mode}</Text>
                                </div>
                                <div>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Has Empty Seats</Text>
                                    <Text className="text-gray-900 dark:text-gray-100">{result.has_empty_seats ? 'Yes' : 'No'}</Text>
                                </div>
                                {result.has_empty_seats && (
                                    <div>
                                        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Seats</Text>
                                        <Text className="text-gray-900 dark:text-gray-100">{result.available_seats_count}</Text>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Daily Schedule */}
                        <Card className="p-4">
                            <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Daily Schedule
                            </Heading>
                            <div className="space-y-3">
                                {sortedSchedule.map((day) => (
                                    <div key={day.event_day_id} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <Text className="font-medium text-indigo-900 dark:text-indigo-100">
                                                    {formatDate(day.event_date)}
                                                </Text>
                                                <Text className="text-sm text-indigo-700 dark:text-indigo-300">
                                                    📍 {day.location_name}
                                                </Text>
                                            </div>
                                            <div className="text-right">
                                                <span className={cn(
                                                    'px-2 py-0.5 text-xs font-medium rounded-full',
                                                    day.staying_with_yatra
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                )}>
                                                    {day.staying_with_yatra ? 'Staying' : 'Not Staying'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Meals */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {day.breakfast_provided && (
                                                <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300">
                                                    🍳 Breakfast {day.breakfast_at_host ? '@ Host' : ''}
                                                </span>
                                            )}
                                            {day.lunch_provided && (
                                                <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300">
                                                    🍽️ Lunch {day.lunch_with_yatra ? 'w/ Yatra' : ''}
                                                </span>
                                            )}
                                            {day.dinner_provided && (
                                                <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300">
                                                    🌙 Dinner {day.dinner_at_host ? '@ Host' : ''}
                                                </span>
                                            )}
                                        </div>

                                        {day.daily_notes && (
                                            <Text className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 italic">
                                                {day.daily_notes}
                                            </Text>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Host Assignments */}
                        {member.host_assignments && member.host_assignments.length > 0 && (
                            <Card className="p-4">
                                <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Host Assignments
                                </Heading>
                                <div className="space-y-2">
                                    {member.host_assignments.map((assignment) => (
                                        <div key={assignment.event_day_id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <Text className="font-medium text-blue-900 dark:text-blue-100">{assignment.host_name}</Text>
                                            <Text className="text-sm text-blue-700 dark:text-blue-300">
                                                📍 {assignment.host_location} • 📞 {assignment.host_phone}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Notes */}
                        {result.notes && (
                            <Card className="p-4">
                                <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Notes
                                </Heading>
                                <Text className="text-gray-700 dark:text-gray-300">{result.notes}</Text>
                            </Card>
                        )}
                    </Stack>
                </div>

                {/* Footer */}
                <div className={cn(
                    'flex items-center justify-end p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50',
                    isMobile && 'sticky bottom-0'
                )}>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
