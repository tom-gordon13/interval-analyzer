import './App.css';
import AuthButton from './auth/auth';
import React, { useEffect, useState } from 'react';
import { Routes } from 'react-router-dom';
import Home from './home/home';
import NavMain from './components/nav-main';
import Cookies from 'js-cookie';
import './styles/tailwind.css';


function App() {
  const [stravaAccessToken, setStravaAccessToken] = useState('');
  const [user, setUser] = useState(null)
  useEffect(() => {
    const token = Cookies.get('stravaAccessToken');
    setStravaAccessToken(token || '');
  }, []);

  return (
    <div className="App pt-0">
      <NavMain />
      {stravaAccessToken ? (
        <Home />
      ) : (
        <div>
          <AuthButton />
        </div>
      )}

      <Routes>
      </Routes>
    </div>
  );
}

export default App;
