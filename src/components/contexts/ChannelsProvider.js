import React, { createContext, useState, useContext } from 'react';

const ChannelsContext = createContext();

export const useChannels = () => {
  return useContext(ChannelsContext);
};

export const ChannelsProvider = ({ children }) => {
  const [channelId, setChannelId] = useState(0);

  const value = {
    channelId,
    setChannelId,
  };

  return (
    <ChannelsContext.Provider value={value}>
      {children}
    </ChannelsContext.Provider>
  );
};
