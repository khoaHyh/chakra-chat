import { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Flex, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Forms from './components/Forms';

const forms = [
  { legend: 'Login', action: '/login', value: 'Login' },
  { legend: 'Register', action: '/register', value: 'Register' },
];

const App = () => {
  useEffect(() => fetchData(), []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3080/');
      const data = await response.json();
      console.log(data);
      console.log('front-end');
    } catch (err) {
      console.log(`app.js error: ${err}`);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box fontSize="xl">
        <Flex w="full" justifyContent="flex-end" p={5}>
          <VStack spacing={1}>
            <Logo h="5vmin" pointerEvents="none" />
          </VStack>
          <ColorModeSwitcher />
        </Flex>
        <Forms forms={forms} />
      </Box>
    </ChakraProvider>
  );
};

export default App;
