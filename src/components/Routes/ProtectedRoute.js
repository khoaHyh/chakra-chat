import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ session, children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        session ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
};
