import React, { useState, useEffect } from 'react';
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

const SERVER = 'http://localhost:3080';
//const SERVER = 'https://discord-clone-api-khoahyh.herokuapp.com/';

let socket;

export const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { channelId } = useChannels();

  const user = localStorage.getItem('session.id');

  useEffect(() => {
    getConversation(channelId);
  }, [channelId]);

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

  const handleSubmit = event => {
    event.preventDefault();
    setInput('');
    //let messageContent = {
    //  sender: user,
    //  message: input,
    //};

    //socket.emit('chat message', messageContent);
    //setInput('');
  };

  let history = useHistory();
  const logout = () => {
    handleLogout(() => {
      history.push('/login');
    });
  };

  //<Tabs>
  //  <TabPanels>
  //    {channels.map((channel, index) => (
  //      <TabPanel p={4} key={index}>
  //        {channel.messages}
  //      </TabPanel>
  //    ))}
  //  </TabPanels>
  //</Tabs>

  return (
    <Flex fontSize="md">
      <Sidebar user={user} />
      <Flex flexDirection="column" p={5}>
        <Box m={5}>
          {messages.map(message => {
            return (
              <Message
                message={message.message}
                timestamp={message.timestamp}
                user={message.sender}
              />
            );
          })}
        </Box>
        <FormControl>
          <Textarea
            w="60vw"
            placeholder="Enter message"
            value={input}
            onChange={event => setInput(event.target.value)}
            size="sm"
            resize="none"
          />
          <Button onClick={handleSubmit}>Send Message</Button>
          <Button w={100} m={2} onClick={logout}>
            Logout
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
};
