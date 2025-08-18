import { useNavigate } from 'react-router-dom';
import { Container, Section } from '../components/primitives/Layout';
import { Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { Footer } from '../components/navigation/AppShell';
import { useState, useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        // Fetch current date from IST timezone (GMT+5:30)
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
        const data = await response.json();
        const istDate = new Date(data.datetime);
        setCurrentDate(istDate);
      } catch (error) {
        console.error('Failed to fetch IST date, falling back to system date:', error);
        // Fallback to system date if internet fetch fails
        setCurrentDate(new Date());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentDate();
  }, []);

  const handleRegisterClick = () => {
    if (!currentDate) return; // Don't proceed if date hasn't loaded yet
    
    const registrationStartDate = new Date('2025-09-01');
    
    if (currentDate >= registrationStartDate) {
      navigate('/participant/register');
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-100 via-white to-white dark:from-indigo-950/60 dark:via-gray-950 dark:to-gray-950" />
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/20" />
          <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-pink-300/30 blur-3xl dark:bg-pink-600/20" />
          <Container>
            <div className="mx-auto max-w-5xl py-14 text-center sm:py-20">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Nachiketa Trust</div>
              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
                Vasundhara ni Vaani - 2025
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:text-lg dark:text-gray-400">
                Amidst grasslands of Bhal, Gujarat.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button 
                  className="h-12 px-6 text-base" 
                  onClick={handleRegisterClick}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Register now'}
                </Button>
                <Button variant="secondary" className="h-12 px-6 text-base" onClick={() => window.open('https://www.youtube.com/@vasundharavani3048', '_blank')}>Explore highlights</Button>
                <Button variant="secondary" className="h-12 px-6 text-base" onClick={() => navigate('/contact')}>Contact Us</Button>
              </div>
            </div>
          </Container>
        </section>

        <Section>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Schedule</h2>
          <p className="text-gray-600 dark:text-gray-400">Detailed itinerary for Vasundhara ni Vaani 2025</p>
        </div>
        
        {/* Mobile Cards View */}
        <div className="block lg:hidden space-y-6">
          {/* Day 1 - 31st Oct 25 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white px-6 py-4 text-center">
              <div className="text-2xl font-bold">31<sup>st</sup> Oct 25</div>
            </div>
            
            {/* Morning Session */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Morning Session</div>
                <div className="text-right">
                  <div className="font-semibold">9 to 12</div>
                  <div className="text-sm">Morning</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Arrival at Kanpar</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">कानपर में आगमन</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Registrations and lunch</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">रजिस्ट्रेशन, मिलन, सत्संग</div>
                </div>
              </div>
            </div>

            {/* Evening Session */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Evening Session</div>
                <div className="text-right">
                  <div className="font-semibold">8 PM</div>
                  <div className="text-sm">Onward</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Monpur - 9 KM</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">मोणपुर - 9 KM</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu jee, Laxman Das jee</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी, मिर बासु जी, लक्ष्मणदास दास जी</div>
                </div>
              </div>
            </div>
          </div>

          {/* Day 2 - 1st Nov 25 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white px-6 py-4 text-center">
              <div className="text-2xl font-bold">1<sup>st</sup> Nov 25</div>
            </div>
            
            {/* Morning Session */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Morning Session</div>
                <div className="text-right">
                  <div className="font-semibold">9 to 12</div>
                  <div className="text-sm">Morning</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Ratanpar - 4 KM</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">रतनपर - 4 KM</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu jee Laxman Das jee.</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी मिर बासु जी, लक्ष्मणदास दास जी</div>
                </div>
              </div>
            </div>

            {/* Evening Session */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Evening Session</div>
                <div className="text-right">
                  <div className="font-semibold">8 PM</div>
                  <div className="text-sm">Onward</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Pachhe gam (Madhi) - 12 KM</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">पच्छेगाम - 12 KM</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu jee, Santhi Priya, Laxman Das jee.</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी, मिर बासु जी, शांति प्रिया, लक्ष्मणदास दास जी</div>
                </div>
              </div>
            </div>
          </div>

          {/* Day 3 - 2nd Nov 25 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white px-6 py-4 text-center">
              <div className="text-2xl font-bold">2<sup>nd</sup> Nov 25</div>
            </div>
            
            {/* Morning Session */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Morning Session</div>
                <div className="text-right">
                  <div className="font-semibold">9 to 12</div>
                  <div className="text-sm">Morning</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Dared - 14 KM</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">दरेड - 14 KM</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu jee. Laxman Das jee.</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी, मिर बासु जी, लक्ष्मणदास दास जी</div>
                </div>
              </div>
            </div>

            {/* Evening Session */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Evening Session</div>
                <div className="text-right">
                  <div className="font-semibold">8.30</div>
                  <div className="text-sm">Onward</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Nasitpur - 10 KM</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">नसीतपुर - 10 KM</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">To depart from respective Gaun, where one would stay over night</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">जहाँ रुके होंगे वहीं से वापस अपने गंतव्य की ओर बिदा होंगे</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Date
                </th>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Gaun
                </th>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Time
                </th>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Vani By
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={2} className="bg-indigo-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="text-lg font-semibold">31<sup>st</sup> Oct 25</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center">
                  <div className="font-semibold">Arrival at Kanpar</div>
                  <div className="font-semibold mt-1">कानपर में आगमन</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center">
                  <div>9 to 12</div>
                  <div className="text-sm">Morning</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left">
                  <div>Registrations and lunch</div>
                  <div className="mt-1">रजिस्ट्रेशन, मिलन, सत्संग</div>
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold">Monpur</div>
                  <div className="font-semibold mt-1">मोणपुर - 9 KM</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div>8 <br/> Onward</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left border-b border-gray-200 dark:border-gray-700">
                  <div>Shabnam jee, Mir Basu jee, Laxman Das jee</div>
                  <div className="mt-1">शबनम जी, मिर बासु जी, लक्ष्मणदास दास जी</div>
                </td>
              </tr>
              <tr>
                <td rowSpan={2} className="bg-indigo-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="text-lg font-semibold">1<sup>st</sup> Nov 25</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center">
                  <div className="font-semibold">Ratanpar</div>
                  <div className="font-semibold mt-1">रतनपर - 4 KM</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center">
                  <div>9 to 12</div>
                  <div className="text-sm">Morning</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left">
                  <div>Shabnam jee, Mir Basu jee Laxman Das jee.</div>
                  <div className="mt-1">शबनम जी मिर बासु जी, लक्ष्मणदास दास जी</div>
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold">Pachhe gam (Madhi)</div>
                  <div className="font-semibold mt-1">पच्छेगाम - 12 KM</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div>8 <br/> Onward</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left border-b border-gray-200 dark:border-gray-700">
                  <div>Shabnam jee, Mir Basu jee, Santhi Priya, Laxman Das jee.</div>
                  <div className="mt-1">शबनम जी, मिर बासु जी, शांति प्रिया, लक्ष्मणदास दास जी</div>
                </td>
              </tr>
              <tr>
                <td rowSpan={2} className="bg-indigo-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="text-lg font-semibold">2<sup>nd</sup> Nov 25</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center">
                  <div className="font-semibold">Dared</div>
                  <div className="font-semibold mt-1">दरेड - 14 KM</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center">
                  <div>9 to 12</div>
                  <div className="text-sm">Morning</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left">
                  <div>Shabnam jee, Mir Basu jee. Laxman Das jee.</div>
                  <div className="mt-1">शबनम जी, मिर बासु जी, लक्ष्मणदास दास जी</div>
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold">Nasitpur</div>
                  <div className="font-semibold mt-1">नसीतपुर - 10 KM</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  <div>8.30</div>
                  <div className="text-sm">Onward</div>
                </td>
                <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left border-b border-gray-200 dark:border-gray-700">
                  <div>To depart from respective Gaun, where one would stay over night</div>
                  <div className="mt-1">जहाँ रुके होंगे वहीं से वापस अपने गंतव्य की ओर बिदा होंगे</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </Section>
      </main>

      <Footer>
        <div className="text-center">
          <Text className="text-sm">
            <div 
              onClick={() => navigate('/contact')} 
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium cursor-pointer hover:underline"
            >
              Contact Us
            </div>
          </Text>
        </div>
      </Footer>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Registration Not Open Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Registration for Vasundhara ni Vaani 2025 will open on September 1st, 2025.
              </p>
              <Button 
                onClick={() => setShowModal(false)}
                className="w-full"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


