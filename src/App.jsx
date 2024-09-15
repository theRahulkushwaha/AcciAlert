import { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { auth } from './firebaseConfig';  
import { onAuthStateChanged, signOut } from 'firebase/auth';

import HomeScreen from './Screens/HomeScreen';
import Feed from './Screens/Feed';
import Signup from './Screens/Signup';
import Login from './Screens/Login';
import Profile from './Screens/Profile';

function App() {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true); 

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe();  
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={user ? <HomeScreen /> : <Login setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/home" element={<HomeScreen />} />
          
          <Route path="/feed" element={user ? <Feed /> : <Login setUser={setUser} />} />
          <Route path="/Profile" element={<Profile setUser={setUser} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
