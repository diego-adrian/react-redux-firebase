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
    usersRef: firebase.database().ref('users'),
    searchLoading: false,
    isChannelStarred: false,
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

  const handleStar = () => {
    const isChannelStarred = !state.isChannelStarred;
    setState(state => ({
      ...state,
      isChannelStarred: isChannelStarred
    }));
    startChannel(isChannelStarred);
  };

  const startChannel = (isChannelStarred) => {
    if (isChannelStarred) {
      state.usersRef.child(`${currentUser.uid}/starred`).update({
        [currentChannel.id]: {
          name: currentChannel.name,
          details: currentChannel.details,
          createdBy: {
            name: currentChannel.createdBy.name,
            avatar: currentChannel.createdBy.avatar
          }          
        }
      });
    } else {
      state.usersRef.child(`${currentUser.uid}/starred`).child(currentChannel.id).remove(err => {
        if (err !== null) {
          console.log(err);
        }
      })
    }
  };

  const removeListener = () => {
    state.messagesRef.off();
    state.privateMessagesRef.off();
  }

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

  const addUserStarsListener = async(channelId, userUid) => {
    try {
      const data = await state.usersRef.child(userUid).child('starred').once('value');
      if (data.val() !== null) {
        const channelIds = Object.keys(data.val());
        const prevStarred = channelIds.includes(channelId);
        setState(state => ({
          ...state,
          isChannelStarred: prevStarred
        }));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (currentUser && currentChannel) {
      addListeners(currentChannel.id);
      addUserStarsListener(currentChannel.id, currentUser.uid);
    }
    return () => {
      removeListener();
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
        handleStar={handleStar}
        isChannelStarred={state.isChannelStarred}
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
