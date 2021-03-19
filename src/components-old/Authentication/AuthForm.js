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
import ErrorMessage from '../ErrorMessage';
import { useAuth } from './use-auth';
import { useHistory, useLocation } from 'react-router-dom';
import {
  lowerCaseCheck,
  upperCaseCheck,
  numbersCheck,
  specialCheck,
  pwLengthCheck,
} from './PasswordValidation';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

const AuthForm = ({ legend, action }) => {
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

  const registerFormData = {
    email: email,
    username: username,
    password: password,
  };

  const loginFormData = { username: username, password: password };

  let history = useHistory();
  //let location = useLocation();
  //let { from } = location.state || { from: { pathname: '/' } };

  const auth = useAuth();

  const handleLogin = () => {
    auth.login(
      setIsLoading,
      loginFormData,
      setError,
      setUsername,
      setPassword,
      user => {
        console.log('AuthForm context: ' + user);
        //history.replace(from);
        history.push('/chat');
      }
    );
  };

  const handleRegister = () => {
    auth.register(registerFormData, setError, () => {
      history.push('/waitingVerify');
    });
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

  const ValidationText = props => {
    return (
      <Text fontSize="sm">
        {props.check ? (
          <CheckIcon color="green.500" />
        ) : (
          <CloseIcon color="red.500" />
        )}{' '}
        {props.message}
      </Text>
    );
  };

  const mapPasswordChecks = obj => {
    return Object.entries(obj).map(([key, value]) => {
      return <ValidationText key={key} check={value} message={`${key}`} />;
    });
  };

  // Renders a visual guide for password validation
  const renderPasswordChecks = () => {
    if (legend === 'Register') {
      const pwValidationChecks = {
        'A lowercase letter': lowerCaseCheck(password),
        'A capital (uppercase) letter': upperCaseCheck(password),
        'A number': numbersCheck(password),
        'A special (!@#$%^&*, etc) character': specialCheck(password),
        'Minimum 8 characters': pwLengthCheck(password),
      };
      return (
        <Stack mt={2}>
          <Heading as="h3" size="md">
            Password must contain the following:
          </Heading>
          {mapPasswordChecks(pwValidationChecks)}{' '}
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

export default AuthForm;
