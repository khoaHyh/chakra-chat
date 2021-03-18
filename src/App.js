import { ChakraProvider, theme, Heading } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BaseLayout from './components/Layouts/BaseLayout';
import { Home } from './Home';
import { Chat } from './Chat';
import { WaitingVerify } from './WaitingVerify';
import { ProtectedRoute } from './ProtectedRoute';
import { Logout } from './Logout';
import { ProvideAuth } from './use-auth';

const App = () => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <ProvideAuth>
          <BrowserRouter>
            <BaseLayout>
              <Switch>
                <Route path="/" exact component={Home} />
                <ProtectedRoute path="/chat">
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
