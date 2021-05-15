import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  FormControl,
  Textarea,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import axios from 'axios';
import { Message } from './Message';

axios.defaults.withCredentials = true;

let socket;

export const Chat = ({ server }) => {
  const [input, setInput] = useState('');
  const scrollToMyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [numOfUsers, setNumOfUsers] = useState(0);

  const user = localStorage.getItem('session.id');

  // Listen to server origin changes
  useEffect(() => {
    socket = io(server, { withCredentials: true });
  }, [server]);

  // Listen for messages received
  useEffect(() => {
    socket.on('connection', data => setNumOfUsers(data.setNumOfUsers));
    socket.on('disconnect', data => setNumOfUsers(data.setNumOfUsers));

    socket.on('receive-message', data => {
      setMessages(existingMsgs => [...existingMsgs, data]);
    });
  }, []);

  // Scroll to the bottom of the element upon message submission
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle message submission
  const sendMessage = event => {
    event.preventDefault();

    const data = {
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

  return (
    <Flex fontSize="md">
      <Flex h="93vh" flexDirection="column" p={5}>
        <Flex h="70vh" mb={5} flexDirection="column" overflowY="auto">
          <Heading as="h4" size="md">
            {`Number of users in chat: ${numOfUsers}`}
          </Heading>
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
