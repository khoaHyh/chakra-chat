import React from 'react';
import { Box, Flex, Heading, List, ListItem, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

export const VerifyEmail = () => {
  let history = useHistory();

  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>
          Verification email sent! Please confirm your email to login.
        </Heading>
        <List>
          <ListItem>
            <Button w={100} m={5} onClick={() => history.push('/login')}>
              Login
            </Button>
          </ListItem>
        </List>
      </Flex>
    </Box>
  );
};
