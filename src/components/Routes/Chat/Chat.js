import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  Textarea,
  Input,
  Tabs,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { handleLogout } from '../../Authentication/AuthUtils';
import { Sidebar } from './Sidebar';
import { useChannels } from '../../contexts/ChannelsProvider';

const SERVER = 'http://localhost:3080';
//const SERVER = 'https://discord-clone-api-khoahyh.herokuapp.com/';

let socket;

export const Chat = () => {
  const [input, setInput] = useState('');
  const { channels } = useChannels();
  const { sendMessage } = useChannels();

  const user = localStorage.getItem('session.id');

  useEffect(() => {
    socket = io(SERVER, {
      withCredentials: true,
    });
  }, [SERVER]);

  const handleSubmit = event => {
    event.preventDefault();

    sendMessage();
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

  return (
    <Flex fontSize="md">
      <Sidebar user={user} />
      <Flex p={5}>
        <Box>
          <Tabs>
            <TabPanels>
              {channels.map((channel, index) => (
                <TabPanel p={4} key={index}>
                  {channel.messages}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
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
