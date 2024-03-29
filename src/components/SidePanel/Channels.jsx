/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Fragment, useEffect } from 'react';
import {Menu, Icon, Modal, Form, Input, Button, Label} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase';

const Channels = ({ user, setCurrentChannel, setPrivateChannel }) => {

  const [isActive, setActive] = useState(false);

  const [state, setState] = useState({
    channel: null,
    channels: [],
    modal: false,
    firstLoad: true,
    activeChannel: '',
    channelRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    typingRef: firebase.database().ref('typing'),
    notifications: [],
    values: {
      channelName: '',
      channelDetails: '',
    },
    errors: {
      channelName: true,
      channelDetails: true
    }
  });

  const setFirstChannel = channels => {
    const firstChannel = channels[0];
    if (state.firstLoad && channels.length > 0) {
      setCurrentChannel(firstChannel);
      setActiveChannel(firstChannel);
      setState(state => ({
        ...state,
        firstLoad: false,
        channel: firstChannel
      }));
      setActive(true);
    }
  }

  const removeListeners = () => {
    state.channelRef.off();
  }
  
  const handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;
    let index = notifications.findIndex(notification => notification.id === channelId);
    if (index !== -1) {
      if (channelId !== currentChannelId) { 
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }
    setState(state => ({
      ...state,
      notifications
    }))
  }

  const addListeners = () => {
    let loadedChannels = [];
    state.channelRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      setState(state => ({
        ...state,
        channels: loadedChannels
      }));
      setFirstChannel(loadedChannels);
    })
  };

  const addNotificationListener = channelId => {
    console.log(state);
    console.log(channelId);
    state.messagesRef.child(channelId).on('value', snap => {
      console.log(state.channel);
      if (state.channel) {
        handleNotifications(channelId, state.channel.id, state.notifications, snap);
      }
    })
  };
  
  useEffect(() => {
    addListeners();
    return () => {
      removeListeners();
      console.log('UNMOUNTED CHANNELS');
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      state.channelRef.on('child_added', snap => {
        addNotificationListener(snap.key);
      });
    }
    return () => {
      removeListeners();
    }
  }, [isActive]);

  const addChannel = async(event) => {
    try {
      event.preventDefault();
      const key = state.channelRef.push().key;
      const newChannel = {
        id: key,
        name: state.values.channelName,
        details: state.values.channelDetails,
        createdBy: {
          name: user.displayName,
          avatar: user.photoURL
        }
      };
      await state.channelRef.child(key).update(newChannel);
      setState(state => ({
        ...state,
        modal: false,
        values: {
          channelName: '',
          channelDetails: '',
        },
        errors: {
          channelName: true,
          channelDetails: true
        }
      }));
    } catch (error) {
      setState(state => ({
        ...state,
        modal: false,
        values: {
          channelName: '',
          channelDetails: '',
        },
        errors: {
          channelName: true,
          channelDetails: true
        }
      }));
      console.log(error.message);
    }
  };

  const setActiveChannel = channel => {
    setState(state => ({
      ...state,
      activeChannel: channel ? channel.id : ''
    }))
  }

  const handleCurrentChannel = channel => {
    setActiveChannel(channel);
    state.typingRef.child(state.channel.id).child(user.uid).remove();
    clearNotifications();
    setCurrentChannel(channel);
    setPrivateChannel(false);
    setState(state => ({
      ...state,
      channel
    }));
  };

  const clearNotifications = () => {
    let index = state.notifications.findIndex(notification => notification.id === state.channel.id);
    if (index !== -1) {
      let updatedNotifications = [...state.notifications];
      updatedNotifications[index].total = state.notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      setState(state => ({
        ...state,
        notifications: updatedNotifications
      }));
    }
  }

  const closeModal = () => {
    setState(state => ({
      ...state,
      values: {
        channelName: '',
        channelDetails: ''
      },
      errors: {
        channelName: true,
        channelDetails: true
      },
      modal: false
    }));
  };

  const openModal = () => {
    setState(state => ({
      ...state,
      modal: true
    }));
  };

  const getNotificationCount = channel => {
    let count = 0;
    state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  }

  const DisplayChannels = () => (
    state.channels.length > 0 && state.channels.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => handleCurrentChannel(channel)}
          name={channel.name}
          style={{ opacity: 0.7}}
          active={channel.id === state.activeChannel}
        >
          { getNotificationCount(channel) && (
            <Label color="red">
              { getNotificationCount(channel)}
            </Label>
          )}
          # {channel.name}
        </Menu.Item>
      )
    )
  );

  const handleChange = event => {
    event.persist();
    setState(state => ({
      ...state,
      values: {
        ...state.values,
        [event.target.name]: event.target.value
      },
      errors: {
        ...state.errors,
        [event.target.name]: event.target.value.length === 0 ? true : false
      }
    }));
  }

  return(
    <Fragment>
      <Menu.Menu style={{ paddingBottom: '2em'}}>
        <Menu.Item>
          <span>
            <Icon name="exchange"/> CHANNELS
          </span>{" "}
          ({state.channels.length}) <Icon name="add" style={{ cursor: 'pointer'}} onClick={openModal}/>
        </Menu.Item>
        <DisplayChannels/>
      </Menu.Menu>
      <Modal basic open={state.modal} onClose={closeModal} closeOnDimmerClick={false}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={addChannel}>
            <Form.Field>
              <Input
              fluid
              label="Name of Channel"
              name="channelName"
              onChange={handleChange}>
              </Input>
            </Form.Field>
            <Form.Field>
              <Input
              fluid
              label="About the Channel"
              name="channelDetails"
              onChange={handleChange}>
              </Input>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={addChannel} disabled={state.errors.channelName || state.errors.channelDetails}>
            <Icon name="checkmark"/>Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove"/>Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  )
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);