import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

export const WaitingVerify = () => {
  return (
    <Box fontSize="xl">
      <Flex w="full" justifyContent="center" p={5}>
        <Heading>
          Verification email sent! Please confirm your email to login.
        </Heading>
      </Flex>
    </Box>
  );
};
