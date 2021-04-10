import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Button, FormControl, Textarea } from '@chakra-ui/react';
import io from 'socket.io-client';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { handleLogout } from '../../Authentication/AuthUtils';
import { Sidebar } from './Sidebar';
import { Message } from './Message';
import { useChannels } from '../../contexts/ChannelsProvider';

axios.defaults.withCredentials = true;

let socket;

export const Chat = ({ server }) => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { channelId } = useChannels();

  const user = localStorage.getItem('session.id');

  // Listen to server origin changes
  useEffect(() => {
    socket = io(server, { withCredentials: true });
  }, []);

  // Listen for messages received
  useEffect(() => {
    socket.on('receive-message', data => {
      setMessages(data);
    });
    return () => socket.off('receive-message');
  }, [input]);

  // Retrieve messages for the respective channel
  useEffect(() => {
    getConversation(channelId);
  }, [channelId]);

  // Scroll to the bottom of the element upon message submission
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations for the respective channel
  const getConversation = async channelId => {
    if (channelId) {
      try {
        const response = await axios.get(
          `${server}/get/conversation?id=${channelId}`
        );
        setMessages(response.data.conversation);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to handle message submission
  const sendMessage = event => {
    event.preventDefault();

    const data = {
      id: channelId,
      message: input,
      timestamp: Date.now(),
      sender: user,
    };

    if (isValidMessage(input)) {
      // Emit message to server
      socket.emit('send-message', data);
      setInput('');
    }
  };

  // Check if the message is valid before sending
  const isValidMessage = input => {
    let validMessage = true;

    console.log(input.trim());
    if (input.trim() === '') validMessage = false;
    return validMessage;
  };

  // Allow user to press Enter to send messages
  const handleKeyPress = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      sendMessage(event);
    }
  };

  // Function to scroll to bottom of element using a div element as ref
  const scrollToBottom = () => {
    scrollToMyRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  let history = useHistory();
  const logout = () => {
    handleLogout(() => {
      history.push('/');
    });
  };

  return (
    <Flex fontSize="md">
      <Sidebar user={user} logout={logout} />
      <Flex h="93vh" flexDirection="column" p={5}>
        <Flex h="70vh" mb={5} flexDirection="column" overflowY="auto">
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
          <Flex justifyContent="center" alignItems="center" flexDirection="row">
            <Textarea
              w="75vw"
              placeholder="Enter message"
              value={input}
              onChange={event => {
                setInput(event.target.value);
              }}
              onKeyPress={e => handleKeyPress(e)}
              size="sm"
              resize="none"
            />
            <Button h={79} w={175} m={5} onClick={e => sendMessage(e)}>
              Send Message
            </Button>
          </Flex>
        </FormControl>
      </Flex>
    </Flex>
  );
};
