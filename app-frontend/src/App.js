import { ChakraProvider, theme, Heading } from '@chakra-ui/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BaseLayout from './components/Layouts/BaseLayout';
import { Home } from './Home';
import { Chat } from './Chat';

const App = () => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <BaseLayout>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/chat" exact component={Chat} />
              <Route path="/" render={() => <Heading>404 Not Found</Heading>} />
            </Switch>
          </BaseLayout>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
};

export default App;
