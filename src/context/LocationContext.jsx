// src/context/LocationContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showCurrentLocMarker, setShowCurrentLocMarker] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation([latitude, longitude]);
          setShowCurrentLocMarker(true);
        },
        (err) => {
          console.warn('Geolocation denied, using fallback');
          // fallback to Sinhgad College
          setCurrentLocation([18.5204, 73.8567]);
          setShowCurrentLocMarker(true);
        }
      );
    } else {
      setCurrentLocation([18.5204, 73.8567]);
      setShowCurrentLocMarker(true);
    }
  }, []);

  return (
    <LocationContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      showCurrentLocMarker,
      setShowCurrentLocMarker,
    }}>
      {children}
    </LocationContext.Provider>
  );
};