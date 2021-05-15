import React from 'react';
import { Flex, Box, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { handleLogout } from '../Authentication/AuthUtils';

const BaseLayout = props => {
  let history = useHistory();

  const logout = () => {
    handleLogout(() => {
      history.push('/login');
    });
  };

  return (
    <>
      <Flex
        direction="column"
        alignItems="center"
        className="base-page"
        {...props}
      >
        <Flex w="full" justifyContent="flex-end" p={2}>
          <Button onClick={logout}>Logout</Button>
          <ColorModeSwitcher />
        </Flex>
        <Box w="100%" m="0 auto">
          {props.children}
        </Box>
      </Flex>
    </>
  );
};

export default BaseLayout;
