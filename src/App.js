import { useState, useEffect } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import BaseLayout from './components/Layouts/BaseLayout';
import { Home } from './components/Routes/Home';
import { Login } from './components/Routes/Login';
import { Register } from './components/Routes/Register';
import { Chat } from './components/Routes/Chat';
import { VerifyEmail } from './components/Routes/VerifyEmail';
import { Logout } from './components/Routes/Logout';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

const App = () => {
  const [session, setSession] = useState(false);

  //function updateSession(status) {
  //  setSession(status);
  //}

  // Check if user is still authenticated
  const getAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3080/');
      if (response.data.id) {
        setSession(true);
        console.log('authenticated', response.data);
      } else {
        setSession(false);
        console.log('not authenticated', response.data);
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
      console.log(error);
    }
    console.log('getAuth ran.');
  };

  useEffect(() => {
    console.log('useEffect ran');
    getAuth();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <BaseLayout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route
              path="/login"
              exact
              render={() => <Login setSession={setSession} />}
            />
            <Route path="/register" exact component={Register} />
            <Route path="/verifyemail" component={VerifyEmail} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/chat" session={session}>
              <Chat />
            </ProtectedRoute>
          </Switch>
        </BaseLayout>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
