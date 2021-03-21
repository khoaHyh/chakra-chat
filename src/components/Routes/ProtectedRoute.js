import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ children, ...rest }) => {
  const sessionId = localStorage.getItem('session.id');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        sessionId ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
};
