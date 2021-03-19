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
import ErrorMessage from '../ErrorMessage';
import { useAuth } from '../Authentication/use-auth';
import { useHistory, useLocation } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

const Login = ({ legend, action }) => {
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
        setIsLoading(false);
        history.push('/chat');
      }
    );
  };

  // Render an error message when invalid credentials are provided on login
  const renderError = () => {
    return error && <ErrorMessage message={error} />;
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
          <Button w="full" mt={2} onClick={handleLogin()}>
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

export default Login;
