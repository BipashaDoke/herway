import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
import SplashScreen from './components/SplashScreen';

import HerMap from './pages/HerMap';
import Journey from './pages/Journey';
import Places from './pages/Places';
import Profile from './pages/Profile';

import { LocationProvider } from './context/LocationContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <BrowserRouter>
          <LocationProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<HerMap />} />
                <Route path="journey" element={<Journey />} />
                <Route path="places" element={<Places />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </LocationProvider>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;