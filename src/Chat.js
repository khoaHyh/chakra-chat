import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';

export const Chat = ({ history }) => {
  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>Authenticated!</Heading>
        <Button w="full" mt={2} onClick={() => history.push('/')}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
