import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export const Chat = () => {
  let history = useHistory();

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3080/logout');
      console.log(response.data.message);
      history.push('/login');
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
  };

  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" alignItems="center" p={5}>
        <Heading>Authenticated!</Heading>
        <Button w={100} m={2} onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
