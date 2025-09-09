import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { cn } from '../../lib/cn';
import type { SummaryStats } from '../../services/endpoints/dashboard.types';

interface DetailedSummaryProps {
  summary: SummaryStats;
  className?: string;
}

export function DetailedSummary({ summary, className }: DetailedSummaryProps) {
  // Helper function to capitalize city names for display
  const capitalizeCityName = (city: string) => {
    return city
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Normalize city names and merge counts for same cities with different cases
  const normalizedCityDistribution = Object.entries(summary.city_distribution).reduce((acc, [city, count]) => {
    const normalizedCity = city.trim().toLowerCase();
    acc[normalizedCity] = (acc[normalizedCity] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  // Sort cities by count (descending) and take top 10
  const topCities = Object.entries(normalizedCityDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const totalParticipants = summary.gender_distribution.M + summary.gender_distribution.F;
  const totalAgeGroups = Object.values(summary.age_groups).reduce((sum, count) => sum + count, 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Registration Overview */}
      <Card className="p-6">
        <Heading className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Registration Overview
        </Heading>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {summary.total_groups}
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Total Groups</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {summary.group_registrations}
            </div>
            <div className="text-sm text-green-800 dark:text-green-200">Group Registrations</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {summary.individual_registrations}
            </div>
            <div className="text-sm text-purple-800 dark:text-purple-200">Individual Registrations</div>
          </div>
          {/* <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {summary.groups_with_empty_seats}
            </div>
            <div className="text-sm text-orange-800 dark:text-orange-200">Groups with Empty Seats</div>
          </div> */}
        </div>
      </Card>

      {/* Transportation & Seating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Transportation
          </Heading>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Text className="text-gray-600 dark:text-gray-400">Public Transport</Text>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(summary.public_transport / (summary.public_transport + summary.private_transport)) * 100}%` }}
                  ></div>
                </div>
                <Text className="font-medium text-gray-900 dark:text-gray-100">
                  {summary.public_transport}
                </Text>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Text className="text-gray-600 dark:text-gray-400">Private Transport</Text>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(summary.private_transport / (summary.public_transport + summary.private_transport)) * 100}%` }}
                  ></div>
                </div>
                <Text className="font-medium text-gray-900 dark:text-gray-100">
                  {summary.private_transport}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Seating Availability
          </Heading>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {summary.total_empty_seats}
            </div>
            <Text className="text-gray-600 dark:text-gray-400">Total Empty Seats</Text>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Across {summary.groups_with_empty_seats} groups
            </div>
          </div>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Gender Distribution
          </Heading>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Text className="text-gray-600 dark:text-gray-400">Male</Text>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(summary.gender_distribution.M / totalParticipants) * 100}%` }}
                  ></div>
                </div>
                <Text className="font-medium text-gray-900 dark:text-gray-100">
                  {summary.gender_distribution.M}
                </Text>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Text className="text-gray-600 dark:text-gray-400">Female</Text>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full" 
                    style={{ width: `${(summary.gender_distribution.F / totalParticipants) * 100}%` }}
                  ></div>
                </div>
                <Text className="font-medium text-gray-900 dark:text-gray-100">
                  {summary.gender_distribution.F}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Age Groups
          </Heading>
          <div className="space-y-3">
            {Object.entries(summary.age_groups).map(([ageGroup, count]) => (
              <div key={ageGroup} className="flex justify-between items-center">
                <Text className="text-gray-600 dark:text-gray-400">{ageGroup} years</Text>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(count / totalAgeGroups) * 100}%` }}
                    ></div>
                  </div>
                  <Text className="font-medium text-gray-900 dark:text-gray-100">
                    {count}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Toilet Preferences */}
      <Card className="p-6">
        <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Daily Toilet Preferences
        </Heading>
        
        {/* Daily Breakdown */}
        <div>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Daily Breakdown</Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(summary.daily_toilet_preferences)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, preferences]) => {
                const total = preferences.indian + preferences.western;
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
                
                return (
                  <div key={date} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center mb-3">
                      <Text className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {formattedDate}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {total} total
                      </Text>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text className="text-xs text-gray-600 dark:text-gray-400">Indian</Text>
                        <Text className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {preferences.indian}
                        </Text>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${(preferences.indian / total) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Text className="text-xs text-gray-600 dark:text-gray-400">Western</Text>
                        <Text className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {preferences.western}
                        </Text>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(preferences.western / total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Card>

      {/* Top Cities */}
      <Card className="p-6">
        <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Top Cities by Participation
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCities.map(([city, count], index) => (
            <div key={city} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </Text>
                </div>
                <Text className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {capitalizeCityName(city)}
                </Text>
              </div>
              <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {count}
              </Text>
            </div>
          ))}
        </div>
        {Object.keys(normalizedCityDistribution).length > 10 && (
          <div className="mt-4 text-center">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              And {Object.keys(normalizedCityDistribution).length - 10} more cities
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}
