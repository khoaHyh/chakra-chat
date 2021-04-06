import React from 'react';
import { List, ListItem, ListIcon } from '@chakra-ui/react';
import { FaHashtag } from 'react-icons/fa';
import { useChannels } from '../../contexts/ChannelsProvider';

export const Channels = () => {
  const { channels } = useChannels();

  return (
    <List>
      {channels.map(channel => (
        <ListItem key={channel.newChannelName} color="gray.500">
          <ListIcon as={FaHashtag} />
          {channel.newChannelName}
        </ListItem>
      ))}
    </List>
  );
};
