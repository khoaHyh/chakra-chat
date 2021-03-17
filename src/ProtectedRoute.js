import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [auth, setAuth] = useState(false);

  const LoggedIn = async () => {
    try {
      const response = await axios.get('http://localhost:3080/chat');
      console.log(response);
      if (response.data.message === 'You are signed in.') setAuth(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    LoggedIn();
  }, []);

  return (
    <Route
      {...rest}
      render={props =>
        auth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};
