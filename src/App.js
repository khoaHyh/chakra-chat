import React, { useEffect } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from './components/Layouts/BaseLayout';
import { Home } from './components/Routes/Home';
import { Login } from './components/Routes/Login';
import { Register } from './components/Routes/Register';
import { Chat } from './components/Routes/Chat/Chat';
import { Logout } from './components/Routes/Logout';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';
import { CheckSessionRoute } from './components/Routes/CheckSessionRoute';
import { Confirmation } from './components/Routes/Confirmation';
import { ChannelsProvider } from './components/contexts/ChannelsProvider';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

//const server = 'http://localhost:8080';
const server = 'https://discord-clone-api-khoahyh.herokuapp.com';

const App = () => {
  // Check if user is still authenticated
  const getAuth = async () => {
    try {
      const response = await axios.get(`${server}/auth`);
      const data = response.data;
      if (data.username) {
        console.log('authenticated', data.username);
        if (!localStorage.getItem('session.id'))
          localStorage.setItem('session.id', data.username);
      } else {
        localStorage.removeItem('session.id');
        console.log('not authenticated', data.username);
      }
    } catch (error) {
      //if (error.response) {
      //  //The request was made and the server responded with a status code
      //  // that falls out of the range of 2xx
      //  console.log(error.response.data);
      //  console.log(error.response.status);
      //  console.log(error.response.headers);
      //} else if (error.request) {
      //  // The request was made but no response was received
      //  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //  // http.ClientRequest in node.js
      //  console.log(error.request);
      //} else {
      //  // Something happened in setting up the request that triggered an Error
      //  console.log('Error message: ', error.message);
      //}
      //if (error.code === 'ECONNABORTED') console.log('timeout');
      //console.log(error.config);
      console.log(error);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <BaseLayout h="50vh">
          <Switch>
            <Route path="/" exact component={Home} />
            <CheckSessionRoute path="/login" exact>
              <Login />
            </CheckSessionRoute>
            <CheckSessionRoute path="/register" exact>
              <Register server={server} />
            </CheckSessionRoute>
            <Route
              exact
              path="/confirmation/:hash"
              render={props => <Confirmation {...props} server={server} />}
            />
            <Route exact path="/logout" component={Logout} />
            <ChannelsProvider>
              <ProtectedRoute exact path="/chat">
                <Chat server={server} />
              </ProtectedRoute>
            </ChannelsProvider>
          </Switch>
        </BaseLayout>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
