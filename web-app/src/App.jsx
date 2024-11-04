import './App.css';
import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home'
import HandleStravaCallback from './pages/HandleStravaCallback';
import ActivityPage from './pages/ActivityPage';
import NavMain from './components/NavMain';
import Cookies from 'js-cookie';
import './styles/tailwind.css';
import { UserContext } from './context/UserContext';


export const App = () => {
  const [stravaAccessToken, setStravaAccessToken] = useState('');
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const token = Cookies.get('stravaAccessToken');
    setStravaAccessToken(token || '');
  }, [stravaAccessToken]);

  return (
    <div className="App pt-0">
      <NavMain />
      <Router>
        <Routes>
          <Route path="/" element={<Home hasToken={!!stravaAccessToken} />} />
          <Route path="/strava-callback" element={<HandleStravaCallback />} />
          <Route path="/activity/:activityId" element={<ActivityPage stravaAccessToken={stravaAccessToken} />} />
        </Routes>
      </Router>
    </div >
  );
}
