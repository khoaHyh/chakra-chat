import { useState } from 'react';
import { ChakraProvider, Box, VStack, Flex, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Forms from './components/Forms';

const forms = [
  { legend: 'Login', action: '/api/login', value: 'Login' },
  { legend: 'Register', action: '/api/register', value: 'Register' },
];

const App = () => {
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
