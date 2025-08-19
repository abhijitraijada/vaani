import { Section } from '../components/primitives/Layout';
import { Text } from '../components/primitives/Typography';
import { Button } from '../components/primitives/Button';
import { Header } from '../components/navigation/AppShell';
import { useNavigate } from 'react-router-dom';

export default function ContactUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        left={<Text className="text-base font-semibold tracking-tight">Vasundhara ni Vaani</Text>}
        right={<Button variant="secondary" onClick={() => navigate('/')}>Home</Button>}
      />

      <main className="flex-1">
        <Section>
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Contact Us</h1>
          </div>

          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-4">
            {/* Contact Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-xl font-bold">1</div>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Revtubha Raijada</div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => window.open('tel:+919979882738')}
                    variant="secondary"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    +91 99798 82738
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-xl font-bold">2</div>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Amarjit Raijada</div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => window.open('tel:+918980623292')}
                    variant="secondary"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    +91 89806 23292
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-xl font-bold">3</div>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Abhijit Raijada</div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => window.open('tel:+919033779035')}
                    variant="secondary"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    +91 90337 79035
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Card 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-xl font-bold">4</div>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Dharmedrasinh</div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => window.open('tel:+919998933283')}
                    variant="secondary"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    +91 99989 33283
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Card 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white px-6 py-4 text-center">
                <div className="text-xl font-bold">5</div>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Mayursinh Gohil</div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => window.open('tel:+919978346183')}
                    variant="secondary"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    +91 99783 46183
                  </Button>
                </div>
              </div>
            </div>
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
                      Phone Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">1</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">Revtubha Raijada</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => window.open('tel:+919979882738')}
                        variant="secondary"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        +91 99798 82738
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">2</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">Amarjit Raijada</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => window.open('tel:+918980623292')}
                        variant="secondary"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        +91 89806 23292
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">3</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">Abhijit Raijada</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => window.open('tel:+919033779035')}
                        variant="secondary"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        +91 90337 79035
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">4</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">Dharmedrasinh</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => window.open('tel:+919998933283')}
                        variant="secondary"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        +91 99989 33283
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">5</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-lg">Mayursinh Gohil</div>
                    </td>
                    <td className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => window.open('tel:+919978346183')}
                        variant="secondary"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                      >
                        +91 99783 46183
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}

