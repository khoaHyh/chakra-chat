import React from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';

export const Message = ({ timestamp, sender, message }) => {
  return (
    <Flex alignItems="center" p={5}>
      <Heading as="h4" size="md">
        {sender}
        <span>{new Date().toUTCString()}</span>
      </Heading>
      <Text>{message}</Text>
    </Flex>
  );
};
