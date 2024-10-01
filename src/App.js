import React, { useEffect } from 'react';
import Home from './pages/Home/Home';
import { encrypt, decrypt } from './utility/EncryptionDecryption';  // Import the encrypt and decrypt functions
import './styles/global.css';

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
