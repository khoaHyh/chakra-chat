import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ children, ...rest }) => {
  const sessionId = localStorage.getItem('session.id');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        // If the redirect prop is not chat and user session exists render child props
        sessionId ? (
          children
        ) : (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        )
      }
    />
  );
};
