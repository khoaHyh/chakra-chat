import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

export const Chat = () => {
  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>Authenticated!</Heading>
      </Flex>
    </Box>
  );
};
