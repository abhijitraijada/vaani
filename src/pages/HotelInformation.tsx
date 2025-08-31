import { Header, Footer } from '../components/navigation/AppShell';
import { Text } from '../components/primitives/Typography';
import { useNavigate } from 'react-router-dom';
import HotelInformation from '../components/shared/HotelInformation';

export default function HotelInformationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        left={<div className="font-semibold tracking-tight text-4xl">Vasundhara ni Vaani</div>}
        right={<button 
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Home
        </button>}
      />

      <main className="flex-1">
        <HotelInformation />
      </main>

      <Footer>
        <div className="text-center space-y-2">
          <Text className="text-sm">
            <div 
              onClick={() => navigate('/')} 
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium cursor-pointer hover:underline"
            >
              Home
            </div>
          </Text>
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
    </div>
  );
}
