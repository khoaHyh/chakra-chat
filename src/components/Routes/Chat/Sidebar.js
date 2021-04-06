import React, { useState, useRef } from 'react';
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
import { useChannels } from '../../contexts/ChannelsProvider';
import { Channels } from './Channels';

export const Sidebar = () => {
  const [newChannelName, setNewChannelName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef();
  const finalRef = useRef();
  const { createChannel } = useChannels();

  const onAddChannel = event => {
    setNewChannelName(event.target.value);
  };

  const handleSave = event => {
    event.preventDefault();
    console.log('Tried to add new channel.');
    createChannel(newChannelName);
    //setNewChannelName('');
    // Only allow the modal to close on save click if field is filled in
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
          <Channels />
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
