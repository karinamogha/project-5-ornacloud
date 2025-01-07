import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ signedIn, setSignedIn, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};