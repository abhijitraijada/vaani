import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import ComponentShowcase from './pages/ComponentShowcase'
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
// Registration closed - routes commented out
// import ScreenRegister from './pages/participant/ScreenRegister'
// import ScreenPreferences from './pages/participant/ScreenPreferences'
// import ScreenVehicle from './pages/participant/ScreenVehicle'
import { HealthProvider } from './providers/HealthProvider'
import { EventProvider } from './providers/EventProvider'
// import { ProtectedParticipantRoute } from './components/shared/ProtectedParticipantRoute'
import { ProtectedRoute } from './components/shared/ProtectedRoute'
// import { RegistrationGate } from './components/shared/RegistrationGate'

function App() {
  return (
    <HealthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hotel-information" element={<HotelInformation />} />

          {/* Event-dependent routes */}
          <Route path="/*" element={
            <EventProvider>
              <Routes>
                {/* Admin protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/participants" element={<ProtectedRoute><Participants /></ProtectedRoute>} />
                <Route path="/hosts" element={<ProtectedRoute><Hosts /></ProtectedRoute>} />
                <Route path="/hosts/:hostId/add-participants" element={<ProtectedRoute><AddParticipants /></ProtectedRoute>} />
                <Route path="/registration-members" element={<RegistrationMembers />} />

                {/* Participant protected routes - REGISTRATION CLOSED
                <Route path="/participant/register" element={<RegistrationGate><ProtectedParticipantRoute><ScreenRegister /></ProtectedParticipantRoute></RegistrationGate>} />
                <Route path="/participant/preferences" element={<RegistrationGate><ProtectedParticipantRoute><ScreenPreferences /></ProtectedParticipantRoute></RegistrationGate>} />
                <Route path="/participant/vehicle" element={<RegistrationGate><ProtectedParticipantRoute><ScreenVehicle /></ProtectedParticipantRoute></RegistrationGate>} />
                */}
              </Routes>
            </EventProvider>
          } />

          {/* Catch-all 404 route - redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </HealthProvider>
  )
}

export default App

