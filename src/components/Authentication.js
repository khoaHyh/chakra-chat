import { useState } from 'react';
import axios from 'axios';
import crypto from 'crypto';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Stack,
  Button,
  Text,
  CircularProgress,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import ErrorMessage from './ErrorMessage';

const Authentication = ({ legend, action, value, history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordVisibility = () => setShow(!show);

  const onUsernameChange = event => {
    setUsername(event.target.value);
  };

  const onPasswordChange = event => {
    setPassword(event.target.value);
  };

  const onEmailChange = event => {
    setEmail(event.target.value);
  };

  const formData = { email: email, username: username, password: password };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // use 'active' property of schema
      const response = await axios.post(
        'http://localhost:3080/login',
        // store production server address in env variable if not on Free Tier
        //'https://discord-clone-api-khoahyh.herokuapp.com/login',
        formData
      );
      // Add check for email verification
      if (response.data) {
        console.log(response.data);
        history.push('/chat');
      } else {
        setError('Invalid username or password');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      console.log(`handleLogin ${err}`);
      setError('500 Internal Server Error');
    }
    setIsLoading(false);
  };

  // add email here and on backend schema
  // add email validation here or backend
  const handleRegister = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3080/register',
        // store production server address in env variable if not on Free Tier
        //'https://discord-clone-api-khoahyh.herokuapp.com/register',
        formData
      );
      if (response.data.username) {
        history.push('/waitingVerify');
      } else {
        setError(`${response.data.message}`);
      }
    } catch (err) {
      console.log(`handleRegister ${err}`);
      setError('500 Internal Server Error');
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
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

  const registerFormValidation = async () => {
    // Check if username contains a minimum of 6 characters and is entirely alphanumeric
    if (alphanumRegex.test(username)) {
      // Use the api to check if the password has been pwned (found in database breach)
      try {
        let response = await fetch(
          `https://api.pwnedpasswords.com/range/${range}`
        );
        let body = await response.text();
        let regex = new RegExp(`^${suffix}:`, 'm');

        if (passwordRegex.test(password)) {
          !regex.test(body)
            ? handleRegister()
            : setError(
                'This password has been found in a database breach. Please enter another password.'
              );
        } else {
          setError('Password does not meet all requirements.');
        }
      } catch (err) {
        console.log(`PwnedPasswords API, ${err}`);
        setError('500 Internal Server Error with PwnedPasswords API');
      }
    } else {
      setError(
        'Username must contain at least 8 characters and be alphanumeric.'
      );
    }
  };

  // Validate lowercase letters
  const lowerCaseCheck = () => {
    let lowerCaseLetters = /[a-z]/g;
    if (!lowerCaseLetters.test(password)) {
      return false;
    }
    return true;
  };

  // Validate uppercase letters
  const upperCaseCheck = () => {
    let upperCaseLetters = /[A-Z]/g;
    if (!upperCaseLetters.test(password)) {
      return false;
    }
    return true;
  };

  // Validate numbers
  const numbersCheck = () => {
    let numbers = /[0-9]/g;
    if (!numbers.test(password)) {
      return false;
    }
    return true;
  };

  // Validate special characters
  const specialCheck = () => {
    let specialChar = /[^a-zA-Z0-9\s]+/g;
    if (!specialChar.test(password)) {
      return false;
    }
    return true;
  };

  // Validate length
  const pwLengthCheck = () => {
    if (password.length < 8) {
      return false;
    }
    return true;
  };

  // Renders a visual guide for password validation
  const renderPasswordChecks = () => {
    if (legend === 'Register') {
      return (
        <Stack mt={2}>
          <Heading as="h3" size="md">
            Password must contain the following:
          </Heading>
          <Text fontSize="sm">
            {lowerCaseCheck() ? (
              <CheckIcon color="green.500" />
            ) : (
              <CloseIcon color="red.500" />
            )}{' '}
            A <b>lowercase</b> letter
          </Text>
          <Text fontSize="sm">
            {upperCaseCheck() ? (
              <CheckIcon color="green.500" />
            ) : (
              <CloseIcon color="red.500" />
            )}{' '}
            A <b>capital (uppercase)</b> letter
          </Text>
          <Text fontSize="sm">
            {numbersCheck() ? (
              <CheckIcon color="green.500" />
            ) : (
              <CloseIcon color="red.500" />
            )}{' '}
            A <b>number</b>
          </Text>
          <Text fontSize="sm">
            {specialCheck() ? (
              <CheckIcon color="green.500" />
            ) : (
              <CloseIcon color="red.500" />
            )}{' '}
            A <b>special (!@#$%^...)</b> character
          </Text>
          <Text fontSize="sm">
            {pwLengthCheck() ? (
              <CheckIcon color="green.500" />
            ) : (
              <CloseIcon color="red.500" />
            )}{' '}
            Minimum <b>8 characters</b>
          </Text>
        </Stack>
      );
    }
  };

  // Render an error message when invalid credentials are provided on login
  const renderError = () => {
    return error && <ErrorMessage message={error} />;
  };

  const renderEmailForm = () => {
    if (legend === 'Register') {
      return (
        <FormControl isRequired>
          <FormLabel htmlFor="email" mt={2} mb={0}>
            Email
          </FormLabel>
          <Input
            type="text"
            id="email"
            name="email"
            placeholder="Enter a valid email address"
            onChange={onEmailChange}
            required
          />
        </FormControl>
      );
    }
  };

  return (
    <Flex minHeight="300px" w="full" justifyContent="center" m={4}>
      <Box
        textAlign="center"
        p={5}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Heading as="h2">{legend}</Heading>
        <form action={action} method="POST">
          {renderEmailForm()}
          <FormControl isRequired>
            {renderError()}
            <FormLabel htmlFor="username" mt={2} mb={0}>
              Username
            </FormLabel>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              onChange={onUsernameChange}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password" mt={2} mb={0}>
              Password
            </FormLabel>
            <InputGroup>
              <Input
                pr="8.5rem"
                type={show ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter password"
                onChange={onPasswordChange}
                required
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handlePasswordVisibility}
                >
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {renderPasswordChecks()}
          <Button
            w="full"
            mt={2}
            onClick={() => {
              legend === 'Login' ? handleLogin() : registerFormValidation();
            }}
          >
            {isLoading ? (
              <CircularProgress isIndeterminate size="24px" color="teal" />
            ) : (
              legend
            )}
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Authentication;
