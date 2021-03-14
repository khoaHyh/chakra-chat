import React from 'react';
import { Box } from '@chakra-ui/react';
import Forms from './components/Forms';

const forms = [
  { legend: 'Login', action: '/login', value: 'Login' },
  { legend: 'Register', action: '/register', value: 'Register' },
];

export const Home = ({ history }) => {
  return (
    <Box fontSize="xl">
      <Forms forms={forms} history={history} />
    </Box>
  );
};
