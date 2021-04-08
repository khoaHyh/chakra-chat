import React, { useState, useRef, useEffect } from 'react';
import {
  Flex,
  VStack,
  Heading,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { MdExpandMore } from 'react-icons/md';
import axios from 'axios';
import { useChannels } from '../../contexts/ChannelsProvider';
import { ChannelList } from './ChannelList';

export const Sidebar = () => {
  const [newChannelName, setNewChannelName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channels, setChannels] = useState([]);

  const initialRef = useRef();
  const finalRef = useRef();

  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3080/get/channelList'
        //'https://discord-clone-api-khoahyh.herokuapp.com/get/channelList',
      );
      console.log(response.data);
      setChannels(response.data);
    } catch (error) {
      //setIsLoading(false);
      if (error.response) {
        //The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log(error.response.data.message);
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

  const onAddChannel = event => {
    setNewChannelName(event.target.value);
  };

  const handleSave = event => {
    event.preventDefault();

    axios.post(
      'http://localhost:3080/new/channel',
      //'https://discord-clone-api-khoahyh.herokuapp.com/new/channel',
      {
        channelName: newChannelName,
      }
    );

    onClose();
  };

  return (
    <>
      <VStack h="100vh" w="300px" p={5} borderRight="solid 1px gray">
        <Flex justifyContent="center" alignItems="center">
          <IconButton
            variant="ghost"
            aria-label="Toggle ExpandMore"
            icon={<MdExpandMore />}
            size="sm"
          />
          <Heading as="h3" size="sm">
            Text Channels
          </Heading>
          <IconButton
            ml={5}
            variant="outline"
            aria-label="Add Channel"
            icon={<AddIcon />}
            size="xs"
            onClick={onOpen}
          />
        </Flex>
        <Flex flexDirection="column" flexGrow={1}>
          <ChannelList channels={channels} />
        </Flex>
      </VStack>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new channel</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Channel name</FormLabel>
              <Input onChange={onAddChannel} placeholder="Channel name" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
