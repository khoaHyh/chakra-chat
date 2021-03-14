import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Route } from 'react-router-dom';
import BaseLayout from './components/Layouts/BaseLayout';
import { Home } from './Home';
import { Chat } from './Chat';

const App = () => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <BaseLayout>
            <Route path="/" exact component={Home} />
            <Route path="/chat" exact component={Chat} />
          </BaseLayout>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
};

export default App;
