import React from 'react';
import { Box } from '@chakra-ui/react';
import Forms from './components/Forms';

const forms = [
  { legend: 'Login', action: '/login' },
  { legend: 'Register', action: '/register' },
];

export const Home = ({ history }) => {
  return (
    <Box fontSize="xl">
      <Forms forms={forms} history={history} />
    </Box>
  );
};
