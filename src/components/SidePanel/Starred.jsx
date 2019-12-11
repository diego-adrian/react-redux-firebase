/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase';

const Starred = ({ user }) => {
  
  const [state, setState] = useState({
    activeChannel: '',
    usersRef: firebase.database().ref('users'),
    starredChannels: []
  });

  const addListeners = userUid => {
    state.usersRef.child(userUid).child('starred').on('child_added', snap => {
      const starredChannel = {
        id: snap.key,
        ...snap.val()
      };
      setState(state => ({
        ...state,
        starredChannels: [...state.starredChannels, starredChannel]
      }));
    });

    state.usersRef.child(userUid).child('starred').on('child_removed', snap => {
      const channelToRemove = {
        id: snap.key,
        ...snap.val()
      };
      const filteredChannels = state.starredChannels.filter(channel => {
        return channel.id !== channelToRemove.id;
      });
      setState(state => ({
        ...state,
        starredChannels: filteredChannels
      }));
    })
  };

  const removeListener = userUid => {
    state.usersRef.child(userUid).child('starred').off();
  }

  useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
    return () => {
      if (user) {
        removeListener(user.uid);
      }
      console.log('UNMOUNT STARRED');
    };
  }, []);
  
  const setActiveChannel = channel => {
    setState(state => ({
      ...state,
      activeChannel: channel ? channel.id : ''
    }))
  };

  const handleCurrentChannel = channel => {
    setActiveChannel(channel);
    setCurrentChannel(channel);
    setPrivateChannel(false);
  };
  
  const DisplayChannels = () => (
    state.starredChannels.length > 0 && state.starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => handleCurrentChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    )
    )
  );
  return (
    <Menu.Menu style={{ paddingBottom: '2em' }}>
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
            </span>{" "}
        ({state.starredChannels.length})
      </Menu.Item>
      <DisplayChannels />
    </Menu.Menu>
  );
}


export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);