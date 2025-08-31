import { useNavigate } from 'react-router-dom';
import { Text } from '../primitives/Typography';
import { Footer } from '../navigation/AppShell';


export function AppFooter() {
  const navigate = useNavigate();


  return (
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
  );
}
