import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showCurrentLocMarker, setShowCurrentLocMarker] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(true); // helpful for loading states

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('geolocation_unsupported');
      setIsLocating(false);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation([latitude, longitude]);
        setShowCurrentLocMarker(true);
        setLocationError(null);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('permission_denied');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationError('position_unavailable');
        } else if (err.code === err.TIMEOUT) {
          setLocationError('timeout');
        } else {
          setLocationError('unknown');
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  }, []);

  // Automatically request location on first load
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        showCurrentLocMarker,
        setShowCurrentLocMarker,
        locationError,
        isLocating,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};