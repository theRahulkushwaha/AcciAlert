import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'leaflet/dist/leaflet.css';


import HomeScreen from './Screens/HomeScreen'
import Feed from './Screens/Feed';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        {/* Define routes for HomeScreen and Feed */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
