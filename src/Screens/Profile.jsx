// src/Screens/Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [editMode, setEditMode] = useState(false);
  
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic here if needed, e.g., clearing tokens or local storage
    navigate('/login'); // Redirect to the login page
    alert('Logged out successfully!');
  };

  // Function to save updated profile information
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
