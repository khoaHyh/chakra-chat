import { useState } from 'react';

const LoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = cb => {
    setLoggedIn(true);
    cb();
  };

  const logout = cb => {
    setLoggedIn(false);
    cb();
  };

  const isLoggedIn = () => {
    return loggedIn;
  };
};

export default LoggedIn;
