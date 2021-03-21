import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { handleLogout } from '../Authentication/AuthUtils';

export const Chat = () => {
  let history = useHistory();
  const logout = () => {
    handleLogout(() => {
      history.push('/login');
    });
  };

  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" alignItems="center" p={5}>
        <Heading>Authenticated!</Heading>
        <Button w={100} m={2} onClick={logout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
