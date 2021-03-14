import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';

const BaseLayout = props => {
  return (
    <>
      <Flex
        direction="column"
        alignItems="center"
        className="base-page"
        {...props}
      >
        <Flex w="full" justifyContent="flex-end" p={5}>
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
