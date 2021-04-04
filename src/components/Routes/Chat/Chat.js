import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Button, Input } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { handleLogout } from '../../Authentication/AuthUtils';

const SERVER = 'http://localhost:3080';
//const SERVER = 'https://discord-clone-api-khoahyh.herokuapp.com/';

let socket;

export const Chat = () => {
  const [input, setInput] = useState('');
  const [messageList, setMessageList] = useState('');
  const [message, setMessage] = useState('');

  const user = localStorage.getItem('session.id');

  useEffect(() => {
    socket = io(SERVER, {
      withCredentials: true,
    });
  }, [SERVER]);

  const sendMessage = event => {
    event.preventDefault();

    let messageContent = {
      sender: user,
      message: input,
    };

    socket.emit('chat message', messageContent);
    setInput('');
  };

  let history = useHistory();
  const logout = () => {
    handleLogout(() => {
      history.push('/login');
    });
  };

  return (
    <Box fontSize="xl">
      <Box>{messageList}</Box>
      <form>
        <Input
          w="80vw"
          type="text"
          value={input}
          placeholder="Enter Message"
          onChange={event => setInput(event.target.value)}
        />
        <Button onClick={sendMessage}>Send Message</Button>
      </form>
      <Flex w="full" justifyContent="center" alignItems="center" p={5}>
        <Heading>Authenticated!</Heading>
        <Button w={100} m={2} onClick={logout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
