import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ComponentShowcase from './pages/ComponentShowcase'
import './App.css'
import Home from './pages/Home'
import ContactUs from './pages/ContactUs'
import HotelInformation from './pages/HotelInformation'
import RegistrationMembers from './pages/RegistrationMembers'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Participants from './pages/Participants'
import Hosts from './pages/Hosts'
import AddParticipants from './pages/AddParticipants'
import ScreenRegister from './pages/participant/ScreenRegister'
import ScreenPreferences from './pages/participant/ScreenPreferences'
import ScreenVehicle from './pages/participant/ScreenVehicle'
import { HealthProvider } from './providers/HealthProvider'
import { EventProvider } from './providers/EventProvider'
import { ProtectedParticipantRoute } from './components/shared/ProtectedParticipantRoute'
import { ProtectedRoute } from './components/shared/ProtectedRoute'

function App() {
  // console.log('App render');
  return (
    <HealthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes that don't require active event */}
          <Route path="/login" element={<Login />} />
          <Route path="/components" element={<ComponentShowcase />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Event-dependent routes */}
          <Route path="/*" element={
            <EventProvider>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/participants" element={<ProtectedRoute><Participants /></ProtectedRoute>} />
                <Route path="/hosts" element={<ProtectedRoute><Hosts /></ProtectedRoute>} />
                <Route path="/hosts/:hostId/add-participants" element={<ProtectedRoute><AddParticipants /></ProtectedRoute>} />
                <Route path="/hotel-information" element={<HotelInformation />} />
                <Route path="/registration-members" element={<RegistrationMembers />} />
                <Route path="/participant/register" element={<ProtectedParticipantRoute><ScreenRegister /></ProtectedParticipantRoute>} />
                <Route path="/participant/preferences" element={<ProtectedParticipantRoute><ScreenPreferences /></ProtectedParticipantRoute>} />
                <Route path="/participant/vehicle" element={<ProtectedParticipantRoute><ScreenVehicle /></ProtectedParticipantRoute>} />
              </Routes>
            </EventProvider>
          } />
        </Routes>
      </BrowserRouter>
    </HealthProvider>
  )
}

export default App
