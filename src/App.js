import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Router components
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile'; // Import the Profile page
import './styles/global.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} /> {/* Profile Route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
