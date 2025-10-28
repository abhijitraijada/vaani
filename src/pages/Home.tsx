import { useNavigate } from 'react-router-dom';
import { Container, Section } from '../components/primitives/Layout';
import { Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { Footer } from '../components/navigation/AppShell';
import { useState } from 'react';
import HotelInformation from '../components/shared/HotelInformation';
import { PhoneInput } from '../components/form/Fields';
import { registrationService } from '../services/endpoints/registration.service';
import type { SearchParticipantResponse } from '../services/endpoints/registration.types';

import { useAppSelector } from '../store';
import { shallowEqual } from 'react-redux';

export default function Home() { 
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // const [currentDate] = useState<Date>(new Date());
  const [searchModal, setSearchModal] = useState(false);
  const [searchData, setSearchData] = useState<SearchParticipantResponse | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { activeEvent, isAuthenticated } = useAppSelector(state => ({
    activeEvent: state.events.activeEvent,
    isAuthenticated: state.user.isAuthenticated
  }), shallowEqual);

  // const handleRegisterClick = () => {
  //   if (!activeEvent) return;
    
  //   // const registrationStartDate = new Date(activeEvent.registration_start_date);

  //   // if (currentDate >= registrationStartDate) {
  //   if (false) {
  //     navigate('/participant/register');
  //   } else {
  //     setShowModal(true);
  //   }
  // };

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      setSearchError('Please enter a phone number');
      return;
    }

    // Remove spaces from phone number
    let cleanedPhoneNumber = phoneNumber.replace(/\s/g, '');
    
    // Remove country code only if phone number is longer than 10 digits
    if (cleanedPhoneNumber.length > 10) {
      if (cleanedPhoneNumber.startsWith('+91')) {
        cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
      } else if (cleanedPhoneNumber.startsWith('91')) {
        cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
      } else if (cleanedPhoneNumber.startsWith('+')) {
        // Remove any other country code starting with +
        cleanedPhoneNumber = cleanedPhoneNumber.substring(1);
      }
    }
    
    // Validate phone number length (should be at least 10 digits)
    if (cleanedPhoneNumber.length < 10) {
      setSearchError('Phone number should be at least 10 digits long');
      return;
    }
    
    // Validate that it contains only digits
    if (!/^\d+$/.test(cleanedPhoneNumber)) {
      setSearchError('Phone number should contain only digits');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const data = await registrationService.searchParticipant(cleanedPhoneNumber);
      setSearchData(data);
      setSearchModal(true);
    } catch (error: any) {
      setSearchError(error.response?.data?.detail || error.message || 'Failed to search registration');
    } finally {
      setSearchLoading(false);
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
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{activeEvent?.ngo}</div>
              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
                {activeEvent?.event_name}
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:text-lg dark:text-gray-400">
                {activeEvent?.description}
              </p>
              {/* <div className="mt-5">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notice</h3>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Participants who do not want to stay as village's guests do not need to register to attend the yatra. 
                  They can attend without registration. Contact the hotel owners directly for accommodation arrangements.
                  Lunch will be provided on prior request; all other meals must be arranged by the participants themselves.
                </p>
              </div> */}
            </div>
          </Container>
        </section>

        {/* Search bar here */}
        <Section>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Check Your Accommodation Details</h2>
            <p className="text-gray-600 dark:text-gray-400">Enter your registered mobile number to view your accommodation arrangements and schedule</p>
          </div>
          
                     <div className="max-w-md mx-auto">
             <div className="flex gap-2">
               <div className="flex-1">
                 <PhoneInput
                   placeholder="Enter mobile number"
                   className="w-full"
                   value={phoneNumber}
                   onChange={(e) => setPhoneNumber(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                 />
               </div>
               <Button 
                 size="md"
                 className="px-6"
                 onClick={handleSearch}
                 loading={searchLoading}
               >
                 Search
               </Button>
             </div>
             {searchError && (
               <p className="text-red-600 text-sm mt-2 text-center">{searchError}</p>
             )}
           </div>
        </Section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* <Button 
            className="h-12 px-6 text-base" 
            onClick={handleRegisterClick}
          >
            Register now
          </Button> */}
          {isAuthenticated && (
            <Button 
              variant="secondary" 
              className="h-12 px-6 text-base" 
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
          )}
          <Button variant="secondary" className="h-12 px-6 text-base" onClick={() => window.open('https://www.youtube.com/@vasundharavani3048', '_blank')}>Explore highlights</Button>
          <Button variant="secondary" className="h-12 px-6 text-base" onClick={() => navigate('/contact')}>Contact Us</Button>
        </div>

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
                 {/*Registration Not Open Yet */}
                 Registration is closed!
               </h3>
               <p className="text-gray-600 dark:text-gray-400 mb-6">
                 {/*Registration for {activeEvent?.event_name} will open on {new Date(activeEvent?.registration_start_date || '').toLocaleDateString()}. */}
                 Registration for {activeEvent?.event_name} is closed!
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

       {/* Search Results Modal */}
       {searchModal && searchData && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                   Registration Details
                 </h2>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => setSearchModal(false)}
                   className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                 >
                   ✕
                 </Button>
               </div>
             </div>

             <div className="p-6 space-y-8">
                               {/* Members Table */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Members ({searchData.members.length})
                  </h3>
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
                        {searchData.members.map((member) => (
                          <tr key={member.id}>
                            <td className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-center border-b border-gray-200 dark:border-gray-700">
                              <div className="font-semibold text-sm sm:text-base">{member.name}</div>
                            </td>
                            <td className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-center border-b border-gray-200 dark:border-gray-700">
                              <div className={`font-semibold text-sm sm:text-base ${
                                member.status === 'confirmed'
                                  ? 'text-green-600 dark:text-green-400'
                                  : member.status === 'registered'
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : member.status === 'cancelled'
                                  ? 'text-red-600 dark:text-red-400'
                                  : member.status === 'waiting'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                               {/* Timeline View */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Event Schedule Timeline ({searchData.daily_schedule.length} days)
                  </h3>
                  
                  <div className="relative">
                    {/* Timeline items */}
                    <div className="space-y-8">
                      {searchData.daily_schedule
                        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                        .map((day) => {
                          // Determine date status
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);
                          const eventDate = new Date(day.event_date);
                          eventDate.setHours(0, 0, 0, 0);
                          
                          const isPast = eventDate < now;
                          const isCurrent = eventDate.getTime() === now.getTime();

                          // Filter members with assignments
                          const membersForThisDay = searchData.members.filter(member => 
                            (member.status === 'registered' || member.status === 'confirmed') &&
                            member.host_assignments?.some(assignment => 
                              assignment.event_day_id === day.event_day_id
                            )
                          );

                          // Dynamic styling
                          
                          const cardBorder = isCurrent
                            ? 'border-green-400 dark:border-green-600 shadow-lg shadow-green-100 dark:shadow-green-900/20' 
                            : isPast
                            ? 'border-gray-300 dark:border-gray-700 opacity-75' 
                            : 'border-indigo-300 dark:border-indigo-700';

                          const cardBg = isCurrent
                            ? 'bg-green-50 dark:bg-green-950/30' 
                            : 'bg-gray-50 dark:bg-gray-800';

                          return (
                            <div key={day.event_day_id} className="relative">
                              
                              {/* Content card */}
                              <div className={`rounded-lg p-4 shadow-sm border transition-all ${cardBg} ${cardBorder}`}>
                                {/* Date Header with Status Badge */}
                                <div className="mb-3">
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                      📅 {new Date(day.event_date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </h4>
                                    {isCurrent && (
                                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                        Today
                                      </span>
                                    )}
                                    {isPast && (
                                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                        Completed
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-sm mt-1 ${
                                    isCurrent 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : isPast 
                                      ? 'text-gray-500 dark:text-gray-500'
                                      : 'text-indigo-600 dark:text-indigo-400'
                                  }`}>
                                    📍 {day.location_name}
                                  </p>
                                </div>

                                {/* Daily Notes */}
                                {day.daily_notes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 break-words">
                                    {day.daily_notes}
                                  </p>
                                )}

                                {/* Meals Section */}
                                {day.staying_with_yatra && (
                                  <div className="flex flex-wrap gap-3 mb-3 text-sm">
                                    <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                      <span>🏠</span> Staying
                                    </div>
                                    {day.breakfast_provided && day.breakfast_at_host && (
                                      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                        <span>🍳</span> Breakfast
                                      </div>
                                    )}
                                    {day.lunch_provided && day.lunch_with_yatra && (
                                      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                        <span>🍽️</span> Lunch
                                      </div>
                                    )}
                                    {day.dinner_provided && day.dinner_at_host && (
                                      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                        <span>🌙</span> Dinner
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Host Assignments */}
                                {membersForThisDay.length > 0 && (
                                  <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                      👥 Host Assignments ({membersForThisDay.length})
                                    </h5>
                                    <div className="grid gap-2 md:grid-cols-2">
                                      {membersForThisDay.map(member => {
                                        const assignment = member.host_assignments?.find(
                                          a => a.event_day_id === day.event_day_id
                                        );
                                        
                                        if (!assignment) return null;
                                        
                                        return (
                                          <div key={member.id} className="bg-white dark:bg-gray-900 rounded p-3 text-xs space-y-1 border border-gray-200 dark:border-gray-700">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 break-words">
                                              👤 {member.name}
                                            </div>
                                            <div className="text-gray-700 dark:text-gray-300 break-words">
                                              🏠 Host: {assignment.host_name || 'TBD'}
                                            </div>
                                            {assignment.host_location && (
                                              <div className="text-gray-600 dark:text-gray-400 break-words">
                                                📍 {assignment.host_location}
                                              </div>
                                            )}
                                            {assignment.host_phone && (
                                              <a 
                                                href={`tel:${assignment.host_phone}`}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline decoration-dotted hover:decoration-solid transition-colors cursor-pointer break-words inline-flex items-center gap-1"
                                              >
                                                📞 {assignment.host_phone}
                                              </a>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Footer */}
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ℹ️ Toilet: {day.toilet_preference.charAt(0).toUpperCase() + day.toilet_preference.slice(1)} | 
                                    Physical Limitations: {day.physical_limitations || 'None'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
             </div>

             <div className="p-6 border-t border-gray-200 dark:border-gray-700">
               <Button
                 onClick={() => setSearchModal(false)}
                 className="w-full"
               >
                 Close
               </Button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}


