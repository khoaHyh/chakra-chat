import React, { useRef } from 'react';
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

export const Sidebar = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef();
  const finalRef = useRef();

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
        <Flex flexDirection="column" flexGrow={1}></Flex>
      </VStack>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new channel</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Channel name</FormLabel>
              <Input placeholder="Channel name" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
