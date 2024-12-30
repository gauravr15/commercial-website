import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import VideoPage from './pages/VideoPage/VideoPage'; // Import VideoPage
import SignInModal from './components/SignInModal/SignInModal';
import AuthContext from './utility/AuthContext';
import './styles/global.css';

function App() {
  const [showSignIn, setShowSignIn] = useState(false); // State to manage sign-in modal visibility
  const { isAuthenticated, loading } = useContext(AuthContext); // Check auth status

  const handleSignInSuccess = () => {
    setShowSignIn(false); // Hide sign-in modal on success
  };

  // Right-click fix
  useEffect(() => {
    const enableRightClick = (e) => {
      e.preventDefault = false; // Ensure right-click is allowed
    };

    // Add event listeners
    window.addEventListener("contextmenu", enableRightClick);

    return () => {
      // Clean up event listeners
      window.removeEventListener("contextmenu", enableRightClick);
    };
  }, []);

  if (loading) {
    console.log("App is loading..."); // Debug log for loading
    return <div>Loading...</div>; // Loading state
  }

  console.log("isAuthenticated:", isAuthenticated);  // Debug log for auth state

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<VideoPage />} /> {/* Add route for VideoPage */}
          {/* Protected route for profile */}
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} 
          />

          {/* SignIn route */}
          <Route 
            path="/signin" 
            element={<SignInModal onClose={() => setShowSignIn(false)} onSignInSuccess={handleSignInSuccess} />} 
          />

          {/* Catch-all: redirect to sign-in page if not authenticated */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/signin"} replace />} 
          />
        </Routes>

        {!isAuthenticated && showSignIn && (
          <SignInModal 
            onClose={() => setShowSignIn(false)} 
            onSignInSuccess={handleSignInSuccess} 
          />
        )}
      </Router>
    </div>
  );
}

export default App;
