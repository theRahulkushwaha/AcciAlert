import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'leaflet/dist/leaflet.css';


import HomeScreen from './Screens/HomeScreen'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <HomeScreen/>
    </>
  )
}

export default App
