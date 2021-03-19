import { useState } from 'react';
import axios from 'axios';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  CircularProgress,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import ErrorMessage from '../ErrorMessage';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

export const Login = ({ setSession }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const formData = { username: username, password: password };

  let history = useHistory();
  //let location = useLocation();
  //let { from } = location.state || { from: { pathname: '/' } };

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
      if (response.data && response.data !== "woot I'm home") {
        console.log('verified! ' + response.data);
        setIsLoading(false);
        setSession(true);
        history.push('/chat');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.log(`handleLogin ${error}`);
      setError('500 Internal Server Error');
      setIsLoading(false);
      if (error.response) {
        //The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message: ', error.message);
      }
      if (error.code === 'ECONNABORTED') console.log('timeout');
      console.log(error.config);
      console.log(error.toJSON());
    }
  };

  // Render an error message when invalid credentials are provided on login
  const renderError = () => {
    return error && <ErrorMessage message={error} />;
  };

  return (
    <Flex h="80vh" w="full" justifyContent="center" alignItems="center">
      <Box
        textAlign="center"
        p={5}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Heading as="h2">Login</Heading>
        <form>
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
            <Button w="full" mt={4} onClick={handleLogin}>
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                'Login'
              )}
            </Button>
          </FormControl>
        </form>
      </Box>
    </Flex>
  );
};
