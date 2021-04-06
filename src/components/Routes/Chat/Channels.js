import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaHashtag } from 'react-icons/fa';
import { useChannels } from '../../contexts/ChannelsProvider';

export const Channels = () => {
  const { channels } = useChannels();

  return (
    <Tabs isManual variant="soft-rounded" orientation="vertical">
      <TabList>
        {channels.map((channel, index) => (
          <Tab key={index} color="gray.500">
            <FaHashtag />
            {channel.newChannelName}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {channels.map((channel, index) => (
          <TabPanel p={4} key={index}>
            {channel.messages}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
