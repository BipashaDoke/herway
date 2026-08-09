import { createContext, useContext, useState } from 'react';

const UserPreferencesContext = createContext();

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    safety: 40,        // weight 0-100
    time: 20,
    accessibility: 25,
    facilities: 15,
    avoidStairs: false,
    preferPublicTransport: false,
    nightTravelPreference: 'neutral', // 'avoid', 'neutral', 'prefer'
  });

  const updatePreferences = (newPrefs) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};