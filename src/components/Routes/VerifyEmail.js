import React, { useState } from 'react';
import { Box, Flex, Heading, List, ListItem, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

export const VerifyEmail = ({ email, server }) => {
  const [error, setError] = useState('');
  const [resent, setResent] = useState('');

  let history = useHistory();

  // Add user email to let them know where it sent
  const resendEmail = async () => {
    try {
      const response = await axios.post(`${server}/resend`, { email: email });
      console.log(response.data.email, response.data.username);
      const message = response.data.message;
      if (message === 'Error') {
        setError(message);
        setResent('');
      } else {
        setResent(message);
        setError('');
      }
    } catch (error) {
      if (error.response) {
        //The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('data:', error.response.data);
        console.log('status:', error.response.status);
        console.log('headers:', error.response.headers);
        setError(`Error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        setError(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message: ', error.message);
        setError(error.message);
      }
      if (error.code === 'ECONNABORTED') console.log('timeout');
      console.log(error.config);
      console.log(error);
    }
  };

  return (
    <Box fontSize="lg">
      <Flex
        w="full"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={5}
      >
        <Flex>
          <Heading as="h3" size="md">
            Verification email sent to {email}! Please confirm your email to
            login.
          </Heading>
        </Flex>
        <Flex w="50vw" justifyContent="center">
          {error ? (
            <ErrorMessage message={error} />
          ) : (
            <Heading color="purple.500" as="h3" size="sm">
              {resent}
            </Heading>
          )}
        </Flex>
        <Flex justifyContent="center">
          <List>
            <ListItem>
              <Button w={100} m={5} onClick={() => history.push('/login')}>
                Login
              </Button>
              <Button w={200} m={5} onClick={() => resendEmail()}>
                Resend Email
              </Button>
            </ListItem>
          </List>
        </Flex>
      </Flex>
    </Box>
  );
};
