import React from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import { FaHashtag } from 'react-icons/fa';
import { useChannels } from '../../contexts/ChannelsProvider';

export const ChannelList = ({ channels }) => {
  const { setChannelId } = useChannels();

  return (
    <Tabs isManual variant="soft-rounded" orientation="vertical">
      <TabList>
        {channels.map(channel => (
          <Tab
            key={channel.id}
            id={channel.id}
            color="gray.500"
            onClick={() => {
              setChannelId(channel.id);
            }}
          >
            <FaHashtag />
            {channel.name}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};
