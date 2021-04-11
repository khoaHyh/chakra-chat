import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const CheckSessionRoute = ({ children, ...rest }) => {
  const sessionId = localStorage.getItem('session.id');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        // If the redirect prop is not chat and user session exists render child props
        sessionId ? (
          <Redirect to={{ pathname: '/chat', state: { from: location } }} />
        ) : (
          children
        )
      }
    />
  );
};
