import { useState } from 'react';
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
import { useHistory } from 'react-router-dom';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import ErrorMessage from '../ErrorMessage';
import {
  lowerCaseCheck,
  upperCaseCheck,
  numbersCheck,
  specialCheck,
  pwLengthCheck,
} from '../Authentication/PasswordValidation';
import { handleRegister } from '../Authentication/AuthUtils';

export const Register = () => {
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

  let history = useHistory();

  const register = () => {
    handleRegister(formData, setError, () => {
      history.push('/verifyemail');
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
      setIsLoading(true);
      try {
        let response = await fetch(
          `https://api.pwnedpasswords.com/range/${range}`
        );
        let body = await response.text();
        let regex = new RegExp(`^${suffix}:`, 'm');

        if (passwordRegex.test(password)) {
          !regex.test(body)
            ? register()
            : setError(
                'This password has been found in a database breach. Please enter another password.'
              );
          setIsLoading(false);
        } else {
          setError('Password does not meet all requirements.');
          setIsLoading(false);
        }
      } catch (err) {
        console.log(`PwnedPasswords API, ${err}`);
        setError('500 Internal Server Error with PwnedPasswords API');
        setIsLoading(false);
      }
    } else {
      setError(
        'Username must contain at least 6 characters and be alphanumeric.'
      );
      setIsLoading(false);
    }
  };

  // Render a password validation check
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

  // Iterate through an object and map the contents out as JSX elements
  const mapPasswordChecks = obj => {
    return Object.entries(obj).map(([key, value]) => {
      return <ValidationText key={key} check={value} message={`${key}`} />;
    });
  };

  // Renders a group of password validation checks
  const renderPasswordChecks = () => {
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
  };

  // Render an error message when invalid credentials are provided on login
  const renderError = () => {
    return error && <ErrorMessage message={error} />;
  };

  return (
    <Flex h="80vh" w="full" justifyContent="center" alignItems="center" m={4}>
      <Box
        textAlign="center"
        p={5}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Heading as="h2">Register</Heading>
        <form>
          <FormControl isRequired>
            {renderError()}
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
          <FormControl isRequired>
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
          <Button w="full" mt={2} onClick={registerFormValidation}>
            {isLoading ? (
              <CircularProgress isIndeterminate size="24px" color="teal" />
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </Box>
    </Flex>
  );
};
