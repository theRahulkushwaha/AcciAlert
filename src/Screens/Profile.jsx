// src/Screens/Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'; 

const Profile = () => {
  const [name, setName] = useState('Name');
  const [email, setEmail] = useState('Email');
  const [editMode, setEditMode] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth(); 

  // Function to handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
        alert('Logged out successfully!');
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  };

  const handleSave = () => {
    setEditMode(false);
    alert('Profile information saved!');
  };

  return (
    <div>
      <h2>Profile Page</h2>
      {editMode ? (
        <>
          <div>
            <label>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Email: </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
      
      {/* Logout button */}
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
};

export default Profile;
