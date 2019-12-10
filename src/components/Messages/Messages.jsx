/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { setUserPosts } from '../../actions';
import firebase from '../../firebase';
import Typing from './Typing';

let timer;

const Messages = ({ currentUser, currentChannel, isPrivateChannel, setUserPosts }) => {
  const [state, setState] = useState({
    messages: [],
    messagesLoading: true,
    countUniqueUsers: 0,
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    usersRef: firebase.database().ref('users'),
    typingRef: firebase.database().ref('typing'),
    connectedRef: firebase.database().ref('.info/connected'),
    typingUsers: [],
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

      const countUserPost = loadedMessages.reduce((acc, message) => {
        if (message.user.name in acc) {
          acc[message.user.name].count += 1;
        } else {
          acc[message.user.name] = {
            avatar: message.user.avatar,
            count: 1
          }
        }
        return acc;
      }, {});
      
      setUserPosts(countUserPost);

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
  
  const DisplayTypingUsers = () => (
    state.typingUsers.length > 0 && state.typingUsers.map(user => (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2em' }} key={user.uid}>
        <span className="user__typing"> {user.name} is typing</span> <Typing />
      </div>
    ))
  );

  const addListeners = channelId => {
    addMessageListener(channelId);
    addTypingListeners(channelId);
  };

  const addTypingListeners = channelId => {
    let typingUsers = [];
    state.typingRef.child(channelId).on('child_added', snap => {
      if (snap.key !== currentUser.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        });
        setState(state => ({
          ...state,
          typingUsers
        })); 
      }
    });
    state.typingRef.child(channelId).on('child_removed', snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        setState(state => ({
          ...state,
          typingUsers
        }));
      }
    });
    state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        state.typingRef.child(channelId).child(currentUser.uid).onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err.message);
          }
        });
      }
    });
  }

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
          <DisplayTypingUsers/>
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

export default connect(null, { setUserPosts })(Messages);
