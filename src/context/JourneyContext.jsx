import { createContext, useContext, useState, useCallback } from 'react';

const JourneyContext = createContext();

export const useJourney = () => useContext(JourneyContext);

export const JourneyProvider = ({ children }) => {
  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [travelTime, setTravelTime] = useState(new Date());
  const [isActive, setIsActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const resetJourney = useCallback(() => {
    setStartLocation(null);
    setDestination(null);
    setRoutes([]);
    setSelectedRoute(null);
    setIsActive(false);
    setCurrentLocation(null);
  }, []);

  return (
    <JourneyContext.Provider
      value={{
        startLocation, setStartLocation,
        destination, setDestination,
        routes, setRoutes,
        selectedRoute, setSelectedRoute,
        travelTime, setTravelTime,
        isActive, setIsActive,
        currentLocation, setCurrentLocation,
        resetJourney,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};