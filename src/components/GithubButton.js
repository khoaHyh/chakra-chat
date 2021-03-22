import { Button } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const GithubButton = ({ message, url }) => {
  const openInNewTab = url => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };
  return (
    <Button
      w="full"
      mt={2}
      rightIcon={<FaGithub />}
      onClick={() => openInNewTab(url)}
    >
      {message}
    </Button>
  );
};

export default GithubButton;
