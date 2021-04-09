import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  Textarea,
  Tabs,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { handleLogout } from '../../Authentication/AuthUtils';
import { Sidebar } from './Sidebar';
import { Message } from './Message';
import { useChannels } from '../../contexts/ChannelsProvider';

axios.defaults.withCredentials = true;

const SERVER = 'http://localhost:3080';
//const SERVER = 'https://discord-clone-api-khoahyh.herokuapp.com/';

let socket;

export const Chat = () => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { channelId } = useChannels();

  const user = localStorage.getItem('session.id');

  useEffect(() => {
    socket = io(SERVER, { withCredentials: true });
  }, [SERVER]);

  useEffect(() => {
    socket.on('receive-message', data => {
      setMessages(data);
    });
    return () => socket.off('receive-message');
  }, [input]);

  useEffect(() => {
    getConversation(channelId);
    socket.on('return-conversation', data => {
      setMessages(data);
    });
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getConversation = async channelId => {
    if (channelId) {
      try {
        const response = await axios.get(
          `http://localhost:3080/get/conversation?id=${channelId}`
          //`https://discord-clone-api-khoahyh.herokuapp.com/get/conversation?id=${channelId}`
        );
        setMessages(response.data.conversation);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const sendMessage = event => {
    event.preventDefault();

    const data = {
      id: channelId,
      message: input,
      timestamp: Date.now(),
      sender: user,
    };

    // Emit message to server
    socket.emit('send-message', data);

    setInput('');
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      sendMessage(event);
    }
  };

  const scrollToBottom = () => {
    scrollToMyRef.current.scrollIntoView({ behavior: 'smooth' });
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
      <Flex h="93vh" flexDirection="column" p={5}>
        <Flex h="70vh" mb={5} w="100%" flexDirection="column" overflow="auto">
          <Box>
            {messages.map((message, index) => {
              return (
                <Message
                  key={index}
                  message={message.message}
                  timestamp={message.timestamp}
                  sender={message.sender}
                />
              );
            })}
            <div ref={scrollToMyRef} />
          </Box>
        </Flex>
        <FormControl>
          <Textarea
            w="60vw"
            placeholder="Enter message"
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyPress={e => handleKeyPress(e)}
            size="sm"
            resize="none"
          />
          <Button onClick={e => sendMessage(e)}>Send Message</Button>
          <Button w={100} m={2} onClick={logout}>
            Logout
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
};
