import './App.scss'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import Profile from './components/Profile'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
