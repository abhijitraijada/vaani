import { useAppSelector, useAppDispatch } from '../store';
import { resetDraft } from '../store/registrationSlice';
import { Container, Section, Card, Stack } from '../components/primitives/Layout';
import { Heading, Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { Header } from '../components/navigation/AppShell';
import { AppFooter } from '../components/shared/AppFooter';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function RegistrationMembers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { registrationResponse } = useAppSelector(state => state.registrationDraft);

  // Clear form data after page loads to prevent ProtectedParticipantRoute from redirecting
  useEffect(() => {
    dispatch(resetDraft());
  }, [dispatch]);

  // If no registration response, redirect to home
  if (!registrationResponse) {
    navigate('/');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 dark:text-green-400';
      case 'registered':
        return 'text-blue-600 dark:text-blue-400';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      case 'waiting':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
      <Header
        left={<Text className="font-semibold tracking-tight text-4xl">Vasundhara ni Vaani</Text>}
        right={<Button variant="secondary" onClick={() => navigate('/')}>Home</Button>}
      />

      <Section className="pt-0">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Card>
              <Stack className="gap-4 text-center">
                <Heading className="text-3xl">Registration Confirmation</Heading>
                <Text className="text-lg text-gray-600 dark:text-gray-400">
                  {/* Registration ID: {registrationResponse.id} */}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Thank you for registering! Here are the details of all registered members.
                </Text>
              </Stack>
            </Card>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            <Card>
              <Stack className="gap-4">
                <Heading className="text-2xl text-center">Registered Members</Heading>
                
                {/* Single Table View for All Screen Sizes */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className="bg-indigo-600 text-white px-4 py-3 text-center font-semibold text-sm sm:text-base border-b border-indigo-700">
                          Name
                        </th>
                        <th className="bg-indigo-600 text-white px-4 py-3 text-center font-semibold text-sm sm:text-base border-b border-indigo-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrationResponse.members.map((member) => (
                        <tr key={member.id}>
                          <td className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-center border-b border-gray-200 dark:border-gray-700">
                            <div className="font-semibold text-sm sm:text-base">{member.name}</div>
                          </td>
                          <td className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-center border-b border-gray-200 dark:border-gray-700">
                            <div className={`font-semibold text-sm sm:text-base ${getStatusColor(member.status)}`}>
                              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-center mt-6">
                  <Button onClick={() => navigate('/')} className="px-8">
                    Back to Home
                  </Button>
                </div>
              </Stack>
            </Card>
          </div>
        </Container>
      </Section>

      <AppFooter />
    </>
  );
}
