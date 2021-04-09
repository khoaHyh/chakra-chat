import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const CheckSessionRoute = ({ component: Component, ...rest }) => {
  const sessionId = localStorage.getItem('session.id');

  return (
    <Route
      {...rest}
      render={props =>
        // If the redirect prop is not chat and user session exists render child props
        sessionId ? (
          <Redirect
            to={{ pathname: '/chat', state: { from: props.location } }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
