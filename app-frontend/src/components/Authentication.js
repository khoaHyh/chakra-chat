import { useState } from 'react';
import axios from 'axios';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';

const Authentication = ({ legend, action, value }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const onUsernameChange = event => {
    setUsername(event.target.value);
  };

  const onPasswordChange = event => {
    setPassword(event.target.value);
  };

  const formData = { username: username, password: password };

  const onLogin = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3080/login',
        formData,
      });
      const data = await response.data;
      console.log(data);
    } catch (err) {
      console.log(`onLogin ${err}`);
    }
  };

  const onRegister = async () => {
    try {
      const response = await axios({
        method: 'post',
        // change this to /register when we set it up on backend
        url: 'http://localhost:3080/login',
        formData,
      });
      const data = await response.data;
      console.log(`register: ${data}`);
    } catch (err) {
      console.log(`onRegister ${err}`);
    }
  };

  return (
    <Flex minHeight="300px" width="full" justifyContent="center" m={4}>
      <Box textAlign="center">
        <Heading as="h2">{legend}</Heading>
        <form action={action} method="POST">
          <FormControl>
            <FormLabel htmlFor="username"></FormLabel>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              onChange={onUsernameChange}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password"></FormLabel>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              onChange={onPasswordChange}
              required
            />
          </FormControl>
          <Button
            w="full"
            mt={2}
            onClick={legend === 'Login' ? onLogin : onRegister}
          >
            {legend}
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Authentication;
