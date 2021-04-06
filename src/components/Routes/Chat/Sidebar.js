import React from 'react';
import { Flex, VStack, Heading, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { MdExpandMore } from 'react-icons/md';

export const Sidebar = ({ user }) => {
  return (
    <>
      <VStack h="100vh" w="300px" p={5}>
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
          />
        </Flex>
        <VStack></VStack>
      </VStack>
    </>
  );
};
