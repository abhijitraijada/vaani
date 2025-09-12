import { Section } from '../primitives/Layout';
import { Button } from '../primitives/Button';

type HotelInfo = {
  number: string;
  name: string;
  hotel: string;
  location: string;
};

const hotelData: HotelInfo[] = [
  {
    number: '9033567734',
    name: 'Dharmeshbhai',
    hotel: 'Radhe Guest House',
    location: 'Vallbhipur'
  },
  {
    number: '8200701212',
    name: 'Jayubhai',
    hotel: 'J.K. Hotel',
    location: 'Vallbhipur'
  },
  {
    number: '7575002523',
    name: 'Kunalbhai Shah',
    hotel: 'Mahendra Puram',
    location: 'Vallbhipur'
  }
];

export default function HotelInformation() {
  return (
    <Section>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Nearby Hotel Information</h2>
        <p className="text-gray-600 dark:text-gray-400">Accommodation options for participants</p>
      </div>

      {/* Notice Section */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notice</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Participants who do not want to stay as village's guests do not need to register to attend the yatra. 
              They can attend without registration. Contact the hotel owners directly for accommodation arrangements.
              Lunch will be provided on prior request; all other meals must be arranged by the participants themselves.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-6">
        {hotelData.map((hotel, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white px-6 py-4 text-center">
              <div className="text-xl font-bold">{index + 1}</div>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">{hotel.name}</div>
                <div className="text-gray-600 dark:text-gray-400 mb-1">{hotel.hotel}</div>
                <div className="text-gray-600 dark:text-gray-400">{hotel.location}</div>
              </div>
              <div className="text-center">
                <Button
                  onClick={() => window.open(`tel:+91${hotel.number}`)}
                  variant="secondary"
                  className="w-full h-12 text-lg font-semibold border-2 border-blue-300 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 dark:bg-blue-900/20 dark:border-blue-600 dark:hover:border-blue-500 dark:text-blue-300 dark:hover:text-blue-200 dark:hover:bg-blue-900/40 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  📞 +91 {hotel.number}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block mx-auto max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Sr. No.
                </th>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Name
                </th>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Hotel
                </th>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Location
                </th>
                <th className="bg-indigo-600 text-white px-6 py-4 text-center font-semibold text-lg border-b border-indigo-700">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {hotelData.map((hotel, index) => (
                <tr key={index}>
                  <td className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-lg">{index + 1}</div>
                  </td>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-lg">{hotel.name}</div>
                  </td>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-lg">{hotel.hotel}</div>
                  </td>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-lg">{hotel.location}</div>
                  </td>
                  <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => window.open(`tel:+91${hotel.number}`)}
                      variant="secondary"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                    >
                      +91 {hotel.number}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
