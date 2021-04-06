import React, { createContext, useState, useContext } from 'react';

const ChannelsContext = createContext();

export const useChannels = () => {
  return useContext(ChannelsContext);
};

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const user = localStorage.getItem('session.id');

  const createChannel = newChannelName => {
    setChannels(prevChannels => {
      return [...prevChannels, { newChannelName, messages: [] }];
    });
  };

  const addMessageToChannel = ({ channel, text, sender }) => {
    setChannels(prevChannels => {
      let channelExists = false;
      const newMessage = { sender, text };

      prevChannels.map(c => {
        if (c === channel) {
          channelExists = true;
        }
        return channel;
      });

      if (channelExists) {
        return [...channel, { channel, newMessage }];
      }
    });
  };

  const sendMessage = (channel, text) => {
    addMessageToChannel({ channel, text, sender: user });
  };

  const value = {
    channels,
    createChannel,
    sendMessage,
  };

  return (
    <ChannelsContext.Provider value={value}>
      {children}
    </ChannelsContext.Provider>
  );
};
