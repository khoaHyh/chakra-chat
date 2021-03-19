import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChakraProvider, theme, Heading } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BaseLayout from './components/Layouts/BaseLayout';
import { Home } from './components/Routes/Home';
import { Chat } from './components/Routes/Chat';
import { WaitingVerify } from './components/Routes/WaitingVerify';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';
import { Logout } from './components/Routes/Logout';
import { ProvideAuth } from './components/Authentication/use-auth';

const App = () => {
  const [auth, setAuth] = useState(false);

  const getAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3080/chat');
      if (response.data.message === 'isAuthenticated.') setAuth(true);
    } catch (error) {
      if (error.response) {
        //The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message: ', error.message);
      }
      if (error.code === 'ECONNABORTED') console.log('timeout');
      console.log(error.config);
      console.log(error.toJSON());
    }
  };
  useEffect(() => {
    getAuth();
  }, []);

  return (
    <>
      <ChakraProvider theme={theme}>
        <ProvideAuth>
          <BrowserRouter>
            <BaseLayout>
              <Switch>
                <Route path="/" exact component={Home} />
                <ProtectedRoute path="/chat" auth={auth}>
                  <Chat />
                </ProtectedRoute>
                <Route path="/waitingVerify" exact component={WaitingVerify} />
                <Route path="/logout" exact component={Logout} />
                <Route
                  path="*"
                  render={() => <Heading p={5}>404 Not Found</Heading>}
                />
              </Switch>
            </BaseLayout>
          </BrowserRouter>
        </ProvideAuth>
      </ChakraProvider>
    </>
  );
};

export default App;
