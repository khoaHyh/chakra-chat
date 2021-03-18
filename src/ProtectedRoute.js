import React, { useState, useEffect, useRef } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './use-auth';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

export const ProtectedRoute = ({ children, ...rest }) => {
  const [session, setSession] = useState(false);
  const isMounted = useRef(false);

  // Get auth state and re-render anytime it changes
  const auth = useAuth();
  console.log('PR auth.user: ' + auth.user);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3080/chat');
      console.log(response.data.message);
      if (isMounted.current) {
        if (response.data.message === 'isAuthenticated') setSession(true);
      }
      return false;
    } catch (error) {
      if (error.response) {
        //The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message: ', error.message);
      }
      if (error.code === 'ECONNABORTED') console.log('timeout');
      console.log(error.config);
      console.log(error.toJSON());
    }
  };

  useEffect(() => {
    isMounted.current = true;
    checkAuth();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (session) {
          return children;
        } else {
          return <Redirect to={{ pathname: '/', state: { from: location } }} />;
        }
      }}
    />
  );
};
