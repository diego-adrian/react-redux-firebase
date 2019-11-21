/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';

const Messages = ({ currentUser, currentChannel }) => {
  const [state, setState] = useState({
    messagesRef: firebase.database().ref('messages')
  })
  return (
    <Fragment>
      <MessagesHeader/>
      <Segment style={{ marginRight: 0, paddingRight: 0}}>
        <Comment.Group className="messages">
        </Comment.Group>
      </Segment>
      <MessageForm currentChannel={currentChannel} messagesRef={state.messagesRef} currentUser={currentUser}/>
    </Fragment>
  )
};

export default Messages;