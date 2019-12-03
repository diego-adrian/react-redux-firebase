import React, { useState } from 'react';
import {Segment, Button, Input} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

const MessageForm = ({ currentUser, messagesRef, currentChannel }) => {
  const [state, setState] = useState({
    storageRef: firebase.storage().ref(),
    loading: false,
    modal: false,
    percentUploaded: 0,
    uploadState: 'uploading',
    uploadTask: null,
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

  const sendFileMessage = async (fileUrl, ref, pathToUpload) => {
    try {
      await ref.child(pathToUpload).push().set(createMessage(fileUrl));
      setState(state => ({
        ...state,
        uploadState: 'done'
      }));
    } catch (error) {
      console.log(error.message);
    }
  }

  const uploadFile = async (file, metadata) => {
    try {
      const pathToUpload = currentChannel.id;
      const ref = messagesRef;
      const filePath = `chat/public/${uuidv4()}.jpg`;
      const uploadTask = state.storageRef.child(filePath).put(file, metadata);
      setState(state => ({
        ...state,
        uploadTask: uploadTask
      }));
      uploadTask.on('state_changed', snap => {
        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setState(state => ({
          ...state,
          percentUploaded: percentUploaded
        }))
      }, () => {
        setState(state => ({
          ...state,
          uploadTask: null
        }));
      }, async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL(); 
        setState(state => ({
          ...state,
          uploadTask: url
        }));
        sendFileMessage(url, ref, pathToUpload);
      });
    } catch (error) {
      setState(state => ({
        ...state,
        uploadTask: null,
        percentUploaded: 0
      }));
    }
  }

  const openModal = () => {
    setState(state => ({
      ...state,
      modal: true
    }))
  };

  const closeModal = () => {
    setState(state => ({
      ...state,
      modal: false
    }))
  }

  const createMessage = (fileUrl = null) => {
    let obj = {};
    if (fileUrl) {
      obj.image = fileUrl;
    } else {
      obj.content = state.values.message;
    }
    const newMessage = {
      ...obj,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        avatar: currentUser.photoURL,
        id: currentUser.uid,
        name: currentUser.displayName
      }
    };
    return newMessage;
  };

  const sendMessage = async() => {
    try {
      setState(state => ({
        ...state,
        loading: true
      }));
      const key = currentChannel.id;
      await messagesRef.child(key).push().set(createMessage());
      setState(state =>  ({
        ...state,
        loading: false,
        values: {
          message: ''
        },
        touched: {
          message: false
        },
        errors: {
          message: true
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
          onClick={openModal}
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
      <FileModal
        modal={state.modal}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
      {
        state.uploadTask && 
        <ProgressBar
          uploadState={state.uploadState}
          uploadTask={state.uploadTask}
          percentUploaded={state.percentUploaded}
        ></ProgressBar>
      }
    </Segment>
  )
};

export default MessageForm;