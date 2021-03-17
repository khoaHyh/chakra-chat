import { ChakraProvider, theme, Heading } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BaseLayout from './components/Layouts/BaseLayout';
import { Home } from './Home';
import { Chat } from './Chat';
import { WaitingVerify } from './WaitingVerify';
import { ProtectedRoute } from './ProtectedRoute';
import { Logout } from './Logout';

const App = () => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <BaseLayout>
            <Switch>
              <Route path="/" exact component={Home} />
              <ProtectedRoute path="/chat" exact component={Chat} />
              <Route path="/waitingVerify" exact component={WaitingVerify} />
              <Route path="/logout" exact component={Logout} />
              <Route
                path="/"
                render={() => <Heading p={5}>404 Not Found</Heading>}
              />
            </Switch>
          </BaseLayout>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
};

export default App;
