import React, { createContext, useState, useContext } from 'react';

const ChannelsContext = createContext();

export const useChannels = () => {
  return useContext(ChannelsContext);
};

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);

  const createChannel = newChannelName => {
    setChannels(prevChannels => {
      return [...prevChannels, { newChannelName }];
    });
  };

  return (
    <ChannelsContext.Provider value={{ channels, createChannel }}>
      {children}
    </ChannelsContext.Provider>
  );
};
