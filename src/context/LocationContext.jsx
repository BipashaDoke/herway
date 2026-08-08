import { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showCurrentLocMarker, setShowCurrentLocMarker] = useState(false);

  // No automatic geolocation request – only the crosshair button triggers it.

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        showCurrentLocMarker,
        setShowCurrentLocMarker,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};