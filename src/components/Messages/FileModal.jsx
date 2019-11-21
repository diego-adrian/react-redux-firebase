import React from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

const FileModal = ({ modal, closeModal }) => {
  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an image File</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          >
        </Input>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
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