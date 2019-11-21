/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';

const Messages = ({ currentUser, currentChannel }) => {
  const [state, setState] = useState({
    messages: [],
    messagesLoading: true,
    messagesRef: firebase.database().ref('messages')
  });

  const DisplayMessages = () => (
    state.messages.length > 0 && state.messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={currentUser}
      />
    ))
  );

  const addMessageListener = channelId => {
    let loadedMessages = [];
    state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      setState(state => ({
        ...state,
        messages: loadedMessages,
        messagesLoading: false
      }))
    })
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
  }, [])

  return (
    <Fragment>
      <MessagesHeader/>
      <Segment style={{ marginRight: 0, paddingRight: 0}}>
        <Comment.Group className="messages">
          <DisplayMessages/>
        </Comment.Group>
      </Segment>
      <MessageForm currentChannel={currentChannel} messagesRef={state.messagesRef} currentUser={currentUser}/>
    </Fragment>
  )
};

export default Messages;
