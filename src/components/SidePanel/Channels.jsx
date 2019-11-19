import React, { useState, Fragment } from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react';

const Channels = () => {
  const [state, setState] = useState({
    channels: [],
    modal: false
  });

  const closeModal = () => {
    setState(state => ({
      ...state,
      channelName: '',
      channelDetails: '',
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
      [event.target.name]: event.target.value
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
      <Modal basic open={state.modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form>
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
          <Button color="green" inverted>
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