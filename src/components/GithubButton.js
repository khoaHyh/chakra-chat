import { Button, Link, Icon } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

// Need to figure out how to redirect users to chat on successful login and save session
// id in localStorage
const GithubButton = ({ message }) => {
  return (
    <Button w="full" mt={2}>
      <Link href="https://chakra-ui.com" isExternal>
        {message} <Icon as={FaGithub} />
      </Link>
    </Button>
  );
};

export default GithubButton;
