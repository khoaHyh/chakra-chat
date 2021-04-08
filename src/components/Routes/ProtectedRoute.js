import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ children, redirect, ...rest }) => {
  const sessionId = localStorage.getItem('session.id');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        // If the redirect prop is not chat and user session exists render child props
        sessionId && redirect !== '/chat' ? (
          children
        ) : (
          <Redirect to={{ pathname: redirect, state: { from: location } }} />
        )
      }
    />
  );
};
