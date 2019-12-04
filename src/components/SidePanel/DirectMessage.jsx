/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase';

const DirectMessage = ({ user, setCurrentChannel, setPrivateChannel }) => {
  const [state, setState] = useState({
    activeChannel: null,
    user: user,
    userRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence'),
    users: []
  });

  const removeListeners = () => {
    state.userRef.off();
    state.connectedRef.off();
    state.presenceRef.off();
  }

  const isUserOnline = user => user.status === 'online';
  
  const getChannelId = userUid => {
    const currentUserUid = state.user.uid;
    return userUid < currentUserUid ? `${userUid}/${currentUserUid}` : `${currentUserUid}/${userUid}`;
  };

  const setActiveChannel = userUid => {
    setState(state => ({
      ...state,
      activeChannel: userUid
    }));
  };

  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    setCurrentChannel(channelData);
    setPrivateChannel(true);
    setActiveChannel(user.uid);
  };

  const ListUsers = () => (
    state.users.map(user => (
      <Menu.Item
        key={user.uid}
        active={state.activeChannel === user.uid}
        onClick={() => changeChannel(user)}
        style={{ opacity: 0.7, fontStyle: 'italic' }}
      >
        <Icon
          name="circle"
          color={isUserOnline(user) ? 'green' : 'red'}
        />
        @ {user.name}
      </Menu.Item>
    ))
  );

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    setState(state => ({
      ...state,
      users: updatedUsers
    }));
  };

  const addListeners = (currentUserUid) => {
    let loadedUsers = [];
    state.userRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        setState(state => ({
          ...state,
          users: loadedUsers
        }));
      }
    });
    state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    state.presenceRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key);
      }
    });

    state.presenceRef.on('child_removed', snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
  };

  useEffect(() => {
    if (state.user) {
      addListeners(state.user.uid);
    }
    return () => {
      removeListeners();
      console.log('UNMOUNT DIRECT MESSAGE');
    };
  }, []); 

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail"/> DIRECT MESSAGES
        </span>{' '}
        ({ state.users.length })
      </Menu.Item>
      <ListUsers />
    </Menu.Menu>
  )
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessage);
