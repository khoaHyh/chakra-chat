import React from 'react';
import { Box } from '@chakra-ui/react';
import MapForms from './components/MapForms';

const forms = [
  { legend: 'Login', action: '/login' },
  { legend: 'Register', action: '/register' },
];

export const Home = () => {
  return (
    <Box fontSize="xl">
      <MapForms forms={forms} />
    </Box>
  );
};
