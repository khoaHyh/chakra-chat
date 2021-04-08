import React from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';

export const Message = ({ timestamp, sender, message }) => {
  return (
    <Flex p={5} flexDirection="column">
      <Flex flexDirection="row" alignItems="center">
        <Heading as="h4" size="md">
          {sender}
        </Heading>
        <Text fontSize="xs" color="gray.500" ml={5}>
          {new Date(parseInt(timestamp)).toLocaleString()}
        </Text>
      </Flex>
      <Text>{message}</Text>
    </Flex>
  );
};
