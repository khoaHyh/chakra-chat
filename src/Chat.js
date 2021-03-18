import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from './use-auth';
import { useHistory } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 3000;

export const Chat = () => {
  let history = useHistory();
  const auth = useAuth();

  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>Authenticated!</Heading>
        <Button
          w="full"
          mt={2}
          onClick={() => {
            auth.logout(() => {
              history.push('/');
            });
          }}
        >
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
