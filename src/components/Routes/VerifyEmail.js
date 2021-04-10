import React, { useState } from 'react';
import { Box, Flex, Heading, List, ListItem, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

export const VerifyEmail = ({ server }) => {
  const [error, setError] = useState('');
  const [resent, setResent] = useState('');

  let history = useHistory();

  // Add user email to let them know where it sent
  const resendEmail = async () => {
    try {
      const response = await axios.get(
        //'http://localhost:3080/resend'
        `${server}/resend`
      );
      console.log(response.data);
      const message = response.data.message;
      if (message === 'Resent the verification email!') {
        setResent(message);
      } else {
        setError(message);
      }
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

  // Render an error message when invalid credentials are provided on login
  const renderError = () => {
    return error && <ErrorMessage message={error} />;
  };

  const renderSuccess = () => {
    return resent && <Heading as="h3">{resent}</Heading>;
  };

  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>
          Verification email sent! Please confirm your email to login.
        </Heading>
        {renderError()}
        {renderSuccess()}
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
    </Box>
  );
};
