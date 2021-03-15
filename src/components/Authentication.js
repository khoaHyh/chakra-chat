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
  Stack,
  Button,
  Text,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

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
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

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

        if (passwordRegex.test(password)) {
          !regex.test(body)
            ? onRegister()
            : // true (pwned), false (not pwned)
              console.log(
                `pwned? ${regex.test(
                  body
                )}, this password has been found in a database breach.`
              );
        } else {
          console.log('Password does need meet all checks');
        }
      } catch (err) {
        console.log(`registerFormValidation ${err}`);
      }
    } else {
      console.log(
        'Username may only contain alphanumeric characters and at least 6 characters'
      );
    }
  };

  // Validate lowercase letters
  const lowerCaseCheck = () => {
    let lowerCaseLetters = /[a-z]/g;
    if (!lowerCaseLetters.test(password)) {
      console.log('Need a lowercase letter');
      return false;
    }
    return true;
  };

  // Validate uppercase letters
  const upperCaseCheck = () => {
    let upperCaseLetters = /[A-Z]/g;
    if (!upperCaseLetters.test(password)) {
      console.log('Need an uppercase letter');
      return false;
    }
    return true;
  };

  // Validate numbers
  const numbersCheck = () => {
    let numbers = /[0-9]/g;
    if (!numbers.test(password)) {
      console.log('Need a number');
      return false;
    }
    return true;
  };

  // Validate special characters
  const specialCheck = () => {
    let specialChar = /[^a-zA-Z0-9\s]+/g;
    if (!specialChar.test(password)) {
      console.log('Need a special character');
      return false;
    }
  };

  // Validate length
  const pwLengthCheck = () => {
    if (password.length <= 8) {
      console.log('Need to have at least 8 characters');
      return false;
    }
    return true;
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
          {legend === 'Login' ? (
            ''
          ) : (
            <Stack mt={5}>
              <Heading as="h3" size="md">
                Password must contain the following:
              </Heading>
              <Text fontSize="md">
                {lowerCaseCheck() ? <CheckIcon /> : <CloseIcon />} A{' '}
                <b>lowercase</b> letter
              </Text>
              <Text fontSize="md">
                {upperCaseCheck() ? <CheckIcon /> : <CloseIcon />} A{' '}
                <b>capital (uppercase)</b> letter
              </Text>
              <Text fontSize="md">
                {numbersCheck() ? <CheckIcon /> : <CloseIcon />} A <b>number</b>
              </Text>
              <Text fontSize="md">
                {specialCheck() ? <CheckIcon /> : <CloseIcon />} A{' '}
                <b>special (!@#$%^...)</b> character
              </Text>
              <Text fontSize="md">
                {pwLengthCheck() ? <CheckIcon /> : <CloseIcon />} Minimum{' '}
                <b>8 characters</b>
              </Text>
            </Stack>
          )}
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
