import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  React.useEffect(() => {
	chrome.storage.local.get(['uuid', 'login'], function(result) {
		if (result.uuid && result.login)
			setUser(result);
	});
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
