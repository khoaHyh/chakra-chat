import React, { useState } from 'react';
import { Flex, VStack, Heading, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { MdExpandMore } from 'react-icons/md';

export const Sidebar = ({ user }) => {
  const [channels, setChannels] = useState();

  const handleAddChannel = event => {
    event.preventDefault();

    const channelName = prompt('Enter a new channel name');

    if (channelName) {
    }
  };

  return (
    <Flex flexDirection="column" height="100vh" p={5}>
      <VStack>
        <Flex justifyContent="space-between" alignItems="center" p={20}>
          <Heading as="h3" size="md">
            khoaHyh discord-clone
          </Heading>
        </Flex>
        <Flex>
          <Flex justifyContent="space-between" alignItems="center" p={10}>
            <Flex alignItems="center">
              <MdExpandMore />
              <Heading as="h4" size="md">
                Text Channels
              </Heading>
            </Flex>
            <IconButton aria-label="Add channel" icon={<AddIcon />} />
          </Flex>
          {}
        </Flex>
        <Heading as="h3" size="md">
          {user}
        </Heading>
      </VStack>
    </Flex>
  );
};
