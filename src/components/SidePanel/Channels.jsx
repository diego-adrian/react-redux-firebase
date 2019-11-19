import React, { useState, Fragment } from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react';
import firebase from '../../firebase';

const Channels = ({ user }) => {
  const [state, setState] = useState({
    channels: [],
    modal: false,
    channelRef: firebase.database().ref('channels'),
    values: {
      channelName: '',
      channelDetails: '',
    },
    errors: {
      channelName: true,
      channelDetails: true
    }
  });

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

export default Channels;