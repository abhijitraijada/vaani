import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ComponentShowcase from './pages/ComponentShowcase'
import './App.css'
import Home from './pages/Home'
import ContactUs from './pages/ContactUs'
import ScreenRegister from './pages/participant/ScreenRegister'
import ScreenPreferences from './pages/participant/ScreenPreferences'
import ScreenVehicle from './pages/participant/ScreenVehicle'
import { HealthProvider } from './providers/HealthProvider'
import { EventProvider } from './providers/EventProvider'
import { ProtectedParticipantRoute } from './components/shared/ProtectedParticipantRoute'

function App() {
  // console.log('App render');
  return (
    <HealthProvider>
      <EventProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/components" element={<ComponentShowcase />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/participant/register" element={<ProtectedParticipantRoute><ScreenRegister /></ProtectedParticipantRoute>} />
          <Route path="/participant/preferences" element={<ProtectedParticipantRoute><ScreenPreferences /></ProtectedParticipantRoute>} />
          <Route path="/participant/vehicle" element={<ProtectedParticipantRoute><ScreenVehicle /></ProtectedParticipantRoute>} />
        </Routes>
      </BrowserRouter>
      </EventProvider>
    </HealthProvider>
  )
}

export default App
