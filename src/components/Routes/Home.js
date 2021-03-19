import React from 'react';
import { Box, Heading, List, ListItem, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

export const Home = () => {
  let history = useHistory();
  return (
    <Box textAlign="center" fontSize="xl">
      <Heading>Home</Heading>
      <List>
        <ListItem>
          <Button w={100} m={5} onClick={() => history.push('/login')}>
            Login
          </Button>
        </ListItem>
        <ListItem>
          <Button w={100} m={5} onClick={() => history.push('/register')}>
            Register
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};
