import React, { useState, useEffect, useRef } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [auth, setAuth] = useState(false);
  const isMounted = useRef(false);

  const LoggedIn = async () => {
    try {
      const response = await axios.get('http://localhost:3080/chat');
      console.log(response);
      if (isMounted.current) {
        if (response.data.message === 'You are signed in.') setAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    LoggedIn();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Route
      {...rest}
      render={props => {
        if (auth) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
        }
      }}
    />
  );
};
