import { useState, useEffect } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from './components/Layouts/BaseLayout';
import { ProvideAuth } from './components/Authentication/use-auth';
import { Home } from './components/Routes/Home';
import { Login } from './components/Routes/Login';
import { Register } from './components/Routes/Register';
import { Chat } from './components/Routes/Chat';
import { VerifyEmail } from './components/Routes/VerifyEmail';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';

const App = () => {
  const [session, setSession] = useState(false);

  const updateSession = exists => {
    setSession(exists);
  };

  // Check if user is still authenticated
  const getAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3080/chat');
      if (response.data.message === 'isAuthenticated.') {
        setSession(true);
      } else {
        setSession(false);
      }
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
    return () => getAuth();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <ProvideAuth>
        <BrowserRouter>
          <BaseLayout>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route
                path="/login"
                exact
                component={Login}
                updateSession={updateSession}
              />
              <Route path="/register" exact component={Register} />
              <Route path="/verifyemail" component={VerifyEmail} />
              <ProtectedRoute path="/chat" session={session}>
                <Chat />
              </ProtectedRoute>
            </Switch>
          </BaseLayout>
        </BrowserRouter>
      </ProvideAuth>
    </ChakraProvider>
  );
};

export default App;
