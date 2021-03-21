import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { handleLogout } from '../Authentication/AuthUtils';

export const Logout = () => {
  let history = useHistory();
  const logout = () => {
    handleLogout(() => {
      history.push('/login');
    });
  };

  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>Force Logout</Heading>
        <Button w="full" mt={2} onClick={logout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};
