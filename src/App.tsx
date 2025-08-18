import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ComponentShowcase from './pages/ComponentShowcase'
import './App.css'
import Home from './pages/Home'
import ContactUs from './pages/ContactUs'
import ScreenRegister from './pages/participant/ScreenRegister'
import ScreenPreferences from './pages/participant/ScreenPreferences'
import ScreenVehicle from './pages/participant/ScreenVehicle'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/components" element={<ComponentShowcase />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/participant/register" element={<ScreenRegister />} />
        <Route path="/participant/preferences" element={<ScreenPreferences />} />
        <Route path="/participant/vehicle" element={<ScreenVehicle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
