import './App.scss'
import { Navbar } from './components/Navbar'
import HeroSection from './components/HeroSection'
import Profile from './components/Profile'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
