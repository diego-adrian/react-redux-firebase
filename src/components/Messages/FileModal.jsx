import React, { useState } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [state, setState] = useState({
    file: null,
    authorized: ['image/jpeg', 'image/png']
  });

  const addFile = event => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setState(state => ({
        ...state,
        file: file
      }))
    }
  };

  const isAuthorized = filename => state.authorized.includes(mime.lookup(filename));

  const clearFile = () => {
    setState(state => ({
      ...state,
      file: null
    }));
  };

  const sendFile = () => {
    const { file } = state;
    if (file) {
      if (isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        clearFile();
      }
    }
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an image File</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          onChange={addFile}
          type="file"
          >
        </Input>
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={!state.file}
          color="green"
          onClick={sendFile}
          inverted
        >
          <Icon name="checkmark"/> Send
        </Button>
        <Button
          color="red"
          inverted
          onClick={closeModal}
        >
          <Icon name="remove"/> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
};

export default FileModal;