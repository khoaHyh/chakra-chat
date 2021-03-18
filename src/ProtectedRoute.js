import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './use-auth';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

// SO FAR session is managed on front end with useContext and other hooks

export const ProtectedRoute = ({ children, ...rest }) => {
  // Get auth state and re-render anytime it changes
  const auth = useAuth();
  console.log('PR auth.user: ' + auth.user);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (auth.user) {
          return children;
        } else {
          return <Redirect to={{ pathname: '/', state: { from: location } }} />;
        }
      }}
    />
  );
};
