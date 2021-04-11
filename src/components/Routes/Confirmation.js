import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, List, ListItem, Button } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

export const Confirmation = ({ server }) => {
  const [message, setMessage] = useState('');

  let history = useHistory();
  let { hash } = useParams();

  useEffect(() => {
    confirmEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmEmail = async () => {
    try {
      const response = await axios.get(`${server}/confirmation/${hash}`);
      console.log('confirmEmail:', response.data.email);
      const email = response.data.email;
      if (email) {
        setMessage(
          `Email '${email}' confirmed! You may login to your account now.`
        );
      } else {
        setMessage(
          `Something went wrong. You may try again or request help with your account.`
        );
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

  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>{message}</Heading>
        <List>
          <ListItem>
            <Button w={100} m={5} onClick={() => history.push('/login')}>
              Login
            </Button>
          </ListItem>
        </List>
      </Flex>
    </Box>
  );
};
