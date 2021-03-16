import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const authenticated = async () => {
    try {
      const response = await axios.get('http://localhost:3080/chat');
      console.log(response.data.message);
      if (!response.data.message) return true;
      return false;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Route
      {...rest}
      render={props => {
        if (authenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
