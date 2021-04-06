import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, Input } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { handleLogout } from '../../Authentication/AuthUtils';
import { Sidebar } from './Sidebar';

const SERVER = 'http://localhost:3080';
//const SERVER = 'https://discord-clone-api-khoahyh.herokuapp.com/';

let socket;

export const Chat = () => {
  const [input, setInput] = useState('');
  const [messageList, setMessageList] = useState('');

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
    <Flex fontSize="md">
      <Sidebar user={user} />
      <Flex p={5}>
        <Box>{messageList}</Box>
        <form>
          <Input
            w="60vw"
            type="text"
            value={input}
            placeholder="Enter Message"
            onChange={event => setInput(event.target.value)}
          />
          <Button onClick={sendMessage}>Send Message</Button>
          <Button w={100} m={2} onClick={logout}>
            Logout
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};
