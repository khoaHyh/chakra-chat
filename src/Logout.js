import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

export const Logout = ({ history }) => {
  const logout = async () => {
    try {
      const response = await axios.get('http://localhost:3080/logout');
      console.log(response.data.message);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>Force Logout</Heading>
        <Button
          w="full"
          mt={2}
          onClick={() => {
            logout();
            history.push('/');
          }}
        >
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
