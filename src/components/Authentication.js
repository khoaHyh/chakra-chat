import { useState } from 'react';
import axios from 'axios';
import crypto from 'crypto';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';

const Authentication = ({ legend, action, value, history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onUsernameChange = event => {
    setUsername(event.target.value);
  };

  const onPasswordChange = event => {
    setPassword(event.target.value);
  };

  const formData = { username: username, password: password };

  const onLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3080/login',
        //'https://discord-clone-api-khoahyh.herokuapp.com/login',
        formData
      );
      if (response.data.username) {
        history.push('/chat');
      } else {
        console.log('denied');
      }
    } catch (err) {
      console.log(`onLogin ${err}`);
    }
  };

  // ADD PASSWORD CHECK FROM HAVEIBEEN PWNED type of API to only
  // allow passwords that haven not been compromised
  // restrict usernames to letters, numbers, -, _ only
  // add email here and on backend
  const onRegister = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3080/register',
        //'https://discord-clone-api-khoahyh.herokuapp.com/register',
        formData
      );
      if (response.data.username) {
        console.log(response.data);
        console.log('verified');
        history.push('/chat');
      } else {
        console.log(response.data.message);
      }
    } catch (err) {
      console.log(`onRegister ${err}`);
    }
  };

  // Implementation of haveIbeenpwned api https://github.com/jamiebuilds/havetheybeenpwned
  let hashed = crypto
    .createHash('sha1')
    .update(password)
    .digest('hex')
    .toUpperCase();

  let range = hashed.slice(0, 5);
  let suffix = hashed.slice(5);

  const alphanumRegex = /^[0-9a-zA-Z]{6,}$/i;
  const registerFormValidation = async () => {
    // Check if username contains a minimum of 6 characters and is entirely alphanumeric
    if (alphanumRegex.test(username)) {
      console.log('Username has correct format');
      // Use the api to check if the password has been pwned (found in database breach)
      try {
        let response = await fetch(
          `https://api.pwnedpasswords.com/range/${range}`
        );
        let body = await response.text();
        let regex = new RegExp(`^${suffix}:`, 'm');

        regex.test(body)
          ? onRegister()
          : // true (pwned), false (not pwned)
            console.log(`pwned? ${regex.test(body)}`);
      } catch (err) {
        console.log(`registerFormValidation ${err}`);
      }
    } else {
      console.log(
        'Username may only contain alphanumeric characters and at least 6 characters'
      );
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
            onClick={() => {
              legend === 'Login' ? onLogin() : registerFormValidation();
            }}
          >
            {legend}
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Authentication;
