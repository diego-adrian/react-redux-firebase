import React, { useState } from 'react';
import {Segment, Button, Input} from 'semantic-ui-react';
import firebase from '../../firebase';

const MessageForm = ({ currentUser, messagesRef, currentChannel }) => {
  const [state, setState] = useState({
    loading: false,
    values: {
      message: ''
    },
    errors: {
      message: true
    },
    touched: {
      message: false
    }
  });

  const sendMessage = async() => {
    try {
      setState(state => ({
        ...state,
        loading: true
      }));
      const newMessage = {
        content: state.values.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          avatar: currentUser.photoURL,
          id: currentUser.uid,
          name: currentUser.displayName
        }
      };
      const key = currentChannel.id;
      await messagesRef.child(key).push().set(newMessage);
      setState(state =>  ({
        ...state,
        loading: false,
        values: {
          message: ''
        }
      }));
    } catch (error) {
      console.error(error.message);
    }
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
        [event.target.name]: event.target.value.length === 0
      },
      touched: {
        ...state.touched,
        [event.target.name]: true
      }
    }));
  };

  return(
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        error={state.errors.message && state.touched.message}
        value={state.values.message}
        onChange={handleChange}
        style={{ marginBottom: '0.7em'}}
        label={<Button icon={'add'}></Button>}
        labelPosition="left"
        placeholder="Write your message"
      />
      <Button.Group icon widths="2">
        <Button
          color="orange"
          onClick={sendMessage}
          loading={state.loading}
          content="Add Reply"
          labelPosition="left"
          disabled={state.errors.message}
          icon="edit"
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  )
};

export default MessageForm;