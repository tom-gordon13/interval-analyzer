import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import HandleStravaCallback from './pages/HandleStravaCallback';
import NavMain from './components/NavMain';
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
      <NavMain user={user} setUser={setUser} />
      <Router>
        <Routes>
          <Route path="/" element={<Home hasToken={!!stravaAccessToken} setUser={setUser} />} />
          <Route path="/strava-callback" element={<HandleStravaCallback setUser={setUser} user={user} />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;
