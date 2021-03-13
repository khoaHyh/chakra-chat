import { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';

const Credentials = ({ legend, action, value }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const onLogin = async () => {
    try {
      const response = await fetch('http://localhost:3080/api/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password,
          username: username,
        }),
      });
      const user = await response.json();
      console.log(user);
      return user;
    } catch (err) {
      console.log(`onLogin ${err}`);
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
              required
            />
          </FormControl>
          <Button w="full" mt={2} type="submit" value={value} onClick={onLogin}>
            {legend}
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Credentials;
