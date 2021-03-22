import React, { useState } from 'react';
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
import { handleLogin } from '../Authentication/AuthUtils';
import GithubButton from '../GithubButton';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

export const Login = () => {
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

  const login = () => {
    handleLogin(
      setIsLoading,
      formData,
      setError,
      setUsername,
      setPassword,
      () => {
        history.push('/chat');
      }
    );
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
          </FormControl>
          <Button w="full" mt={4} onClick={login}>
            {isLoading ? (
              <CircularProgress isIndeterminate size="24px" color="teal" />
            ) : (
              'Login'
            )}
          </Button>
          <Button w="full" mt={2} onClick={() => history.push('/register')}>
            Register
          </Button>
          <GithubButton
            url="https://discord-clone-api-khoahyh.herokuapp.com/auth/github"
            message="Login with Github"
          />
        </form>
      </Box>
    </Flex>
  );
};
