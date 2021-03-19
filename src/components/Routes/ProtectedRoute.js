import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { CircularProgress } from '@chakra-ui/react';
//import { useAuth } from '../Authentication/use-auth';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

// SO FAR session is managed on front end with useContext and other hooks

export const ProtectedRoute = ({ auth, loading, children, ...rest }) => {
  // Get auth state and re-render anytime it changes
  //const auth = useAuth();
  //console.log('PR auth.user: ', auth.user);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        )
      }
    />
  );
};
