import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Section } from '../components/primitives/Layout';
import { Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { Footer } from '../components/navigation/AppShell';
import HotelInformation from '../components/shared/HotelInformation';
import { RegistrationCountdown } from '../components/shared/RegistrationCountdown';
import { REGISTRATION_START } from '../components/shared/RegistrationGate';

export default function Home() {
  const navigate = useNavigate();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    const checkRegistration = () => {
      const now = new Date();
      setIsRegistrationOpen(now >= REGISTRATION_START);
    };

    checkRegistration();
    const timer = setInterval(checkRegistration, 1000);
    return () => clearInterval(timer);
  }, []);

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
                Vasundhara ni Vaani - 2026
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:text-lg dark:text-gray-400">
                Amidst grasslands of Bhal, Gujarat.
              </p>
            </div>
          </Container>
        </section>

        {/* Registration Section - Dynamic based on time */}
        <Section>
          <div className="mx-auto max-w-4xl">
            {isRegistrationOpen ? (
              /* Registration is open - show Register button */
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-2 border-indigo-400 dark:border-indigo-600 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 dark:bg-indigo-800 px-6 py-4 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <span className="text-3xl">📝</span>
                    REGISTRATION OPEN
                    <span className="text-3xl">📝</span>
                  </h2>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Register now to join us for Vasundhara ni Vaani 2026!
                  </p>
                  <Button
                    variant="primary"
                    className="h-14 px-8 text-lg font-semibold"
                    onClick={() => navigate('/participant/register')}
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            ) : (
              /* Registration not yet open - show countdown */
              <RegistrationCountdown startTime={REGISTRATION_START} />
            )}
          </div>
        </Section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button variant="secondary" className="h-12 px-6 text-base" onClick={() => window.open('https://www.youtube.com/@vasundharavani3048', '_blank')}>Explore highlights</Button>
          <Button variant="secondary" className="h-12 px-6 text-base" onClick={() => navigate('/contact')}>Contact Us</Button>
        </div>

        <Section>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Schedule</h2>
            <p className="text-gray-600 dark:text-gray-400">Detailed itinerary for Vasundhara ni Vaani 2026</p>
          </div>

          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-6">
            {/* Day 1 - 21st March 26 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-2xl font-bold">21<sup>st</sup> March 26</div>
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
                    <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu Khan, Laxmandas jee</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 2 - 22nd March 26 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-2xl font-bold">22<sup>nd</sup> March 26</div>
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
                    <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu Khan, Laxmandas jee.</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
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
                    <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu Khan, Laxmandas jee.</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 3 - 23rd March 26 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-2xl font-bold">23<sup>rd</sup> March 26</div>
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
                    <div className="font-medium text-gray-700 dark:text-gray-300">Shabnam jee, Mir Basu Khan, Laxmandas jee.</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
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
                    <div className="text-lg font-semibold">21<sup>st</sup> March 26</div>
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
                    <div>8 <br /> Onward</div>
                  </td>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left border-b border-gray-200 dark:border-gray-700">
                    <div>Shabnam jee, Mir Basu Khan, Laxmandas jee</div>
                    <div className="mt-1">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
                  </td>
                </tr>
                <tr>
                  <td rowSpan={2} className="bg-indigo-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-semibold">22<sup>nd</sup> March 26</div>
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
                    <div>Shabnam jee, Mir Basu Khan, Laxmandas jee.</div>
                    <div className="mt-1">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
                  </td>
                </tr>
                <tr>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div className="font-semibold">Pachhe gam (Madhi)</div>
                    <div className="font-semibold mt-1">पच्छेगाम - 12 KM</div>
                  </td>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div>8 <br /> Onward</div>
                  </td>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-left border-b border-gray-200 dark:border-gray-700">
                    <div>Shabnam jee, Mir Basu Khan, Laxmandas jee.</div>
                    <div className="mt-1">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
                  </td>
                </tr>
                <tr>
                  <td rowSpan={2} className="bg-indigo-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-semibold">23<sup>rd</sup> March 26</div>
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
                    <div>Shabnam jee, Mir Basu Khan, Laxmandas jee.</div>
                    <div className="mt-1">शबनम जी, मिर बासु खान, लक्ष्मणदास दास जी</div>
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

        {/* Hotel Information Section */}
        <HotelInformation />
      </main>

      <Footer>
        <div className="text-center space-y-2">
          <Text className="text-sm">
            <div
              onClick={() => navigate('/contact')}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium cursor-pointer hover:underline"
            >
              Contact Us
            </div>
          </Text>
          <Text className="text-sm">
            <div
              onClick={() => navigate('/hotel-information')}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium cursor-pointer hover:underline"
            >
              Hotel Information
            </div>
          </Text>
        </div>
      </Footer>
    </div>
  );
}


