import './App.css';
import AuthButton from './auth/auth';
import React, { useEffect, useState } from 'react';
import { Routes } from 'react-router-dom';
import Home from './home/home';
import NavMain from './components/nav-main';
import Cookies from 'js-cookie';
import './tailwind.css';


function App() {
  const [stravaAccessToken, setStravaAccessToken] = useState('');
  useEffect(() => {
    const token = Cookies.get('stravaAccessToken');
    setStravaAccessToken(token || ''); // Set an empty string if the token is not found
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <NavMain />
        <h3>
          Strava Interval Analyzer
        </h3>
        {stravaAccessToken ? (
          // <MyContext.Provider value={{ stravaAccessToken, setStravaAccessToken }}>
          <Home />
          // </MyContext.Provider>
        ) : (
          <div>
            <AuthButton />
          </div>
        )}

        <Routes>
        </Routes>
      </header>
    </div>
  );
}

export default App;
