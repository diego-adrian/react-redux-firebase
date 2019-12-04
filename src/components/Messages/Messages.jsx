/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';

let timer;

const Messages = ({ currentUser, currentChannel, isPrivateChannel }) => {
  const [state, setState] = useState({
    messages: [],
    messagesLoading: true,
    countUniqueUsers: 0,
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    searchLoading: false,
    searchTerm: null,
    typing: false,
    searchResults: []
  });

  const DisplayMessages = ({messages}) => (
    messages.length > 0 && messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={currentUser}
      />
    ))
  );

  const getMessagesRef = () => isPrivateChannel ? state.privateMessagesRef : state.messagesRef;

  const addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      const countUniqueUsers = loadedMessages.reduce((newArray, message) => {
        if (!newArray.includes(message.user.name)) {
          newArray.push(message.user.name);
        }
        return newArray;
      }, []);
      setState(state => ({
        ...state,
        messages: loadedMessages,
        messagesLoading: false,
        countUniqueUsers: countUniqueUsers.length
      }))
    })
  };

  const handleSearchMessages = event => {
    event.persist();
    const channelMessages = [...state.messages];
    const regex = new RegExp(event.target.value, 'gi');
    const searchResults = channelMessages.reduce((container, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        container.push(message);
      }
      return container;
    }, []);
    clearTimeout(timer);
    timer = setTimeout(() => {
      setState(state => ({
        ...state,
        typing: false
      }));
    }, 1000);
    setState(state => ({
      ...state,
      typing: true,
      searchLoading: true,
      searchTerm: event.target.value.length > 0 ? true : false,
      searchResults: searchResults
    }));
  };
  
  const addListeners = channelId => {
    addMessageListener(channelId);
  };

  useEffect(() => {
    if (currentUser && currentChannel) {
      addListeners(currentChannel.id);
    }
    return () => {
      console.log('UNMOUNT MESSAGES');
    }
  }, []);

  return (
    <Fragment>
      <MessagesHeader 
        channel={currentChannel} 
        isPrivateChannel={isPrivateChannel} 
        countUniqueUsers={state.countUniqueUsers} 
        handleSearchMessages={handleSearchMessages} 
        typing={state.typing}
      />
      <Segment style={{ marginRight: 0, paddingRight: 0}}>
        <Comment.Group className="messages">
          {
            state.searchTerm ? <DisplayMessages messages={state.searchResults} /> : <DisplayMessages messages={state.messages} />
          }
        </Comment.Group>
      </Segment>
      <MessageForm 
        currentChannel={currentChannel} 
        messagesRef={state.messagesRef} 
        currentUser={currentUser} 
        isPrivateChannel={isPrivateChannel}
        getMessagesRef={getMessagesRef}
      />
    </Fragment>
  )
};

export default Messages;
