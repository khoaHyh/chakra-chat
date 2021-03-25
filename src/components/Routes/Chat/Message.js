import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Message = ({ user, timestamp, message }) => {
  return (
    <Box>
      <Box>
        <Text>
          <span>timestamp</span>
        </Text>
      </Box>
    </Box>
  );
};

export default Message;
