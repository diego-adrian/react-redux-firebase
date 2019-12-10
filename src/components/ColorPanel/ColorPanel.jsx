/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { setColors } from '../../actions';
const ColorPanel = ({ currentUser, setColors }) => {
  
  const [state, setState] =  useState({
    modal: false,
    primary: '',
    secondary: '',
    userColors: [],
    usersRef: firebase.database().ref('users')
  });

  const addListener = userUid => {
    let userColors = [];
    state.usersRef.child(`${userUid}/colors`).on('child_added', snap => {
      userColors.unshift(snap.val());
      setState(state => ({
        ...state,
        userColors
      }));
    })
  };

  useEffect(() => {
    if (currentUser) {
      addListener(currentUser.uid);
    }
    return () => {
      console.log('UNMOUNT COLOR PANEL');
    }
  }, []);

  const handleChangePrimary = color => setState(state => ({
    ...state,
    primary: color.hex
  }));

  const handleChangeSecondary = color => setState(state => ({
    ...state,
    secondary: color.hex
  }));

  const openModal = () => setState(state => ({
    ...state,
    modal: true
  }));

  const closeModal = () => setState(state => ({
    ...state,
    modal: false
  }));

  const handleSaveColors = () => {
    if (state.primary && state.secondary) {
      saveColors(state.primary, state.secondary);
    }
  };

  const DisplayUserColor = () => (
    state.userColors.length > 0 && state.userColors.map((color, i) => (
      <Fragment key={i}>
        <Divider/>
        <div className="color__container" onClick={() => setColors(color.primary, color.secondary)}>
          <div className="color__square" style={{ background: color.primary }}>
            <div className="color__overlay" style={{ background: color.secondary }}></div>
          </div>
        </div>
      </Fragment>
    ))
  )

  const saveColors = async(primary, secondary) => {
    try {
      await state.usersRef.child(`${currentUser.uid}/colors`).push().update({
        primary,
        secondary
      });
      closeModal();
    } catch (error) {
      console.log(error.message);
    }
  }

  return(
    <Sidebar
      as={Menu}
      icon="labeled"
      inverted
      vertical
      visible
      width="very thin"
    >
      <Divider/>
      <Button icon="add" size="small" color="blue" onClick={openModal}></Button>
      <DisplayUserColor/>
      {/* Color Picker Modal */}
      <Modal basic open={state.modal} onClose={closeModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary Color"/>
            <SliderPicker color={state.primary} onChange={handleChangePrimary}/>
          </Segment>
          <Segment inverted>
            <Label content="Secondary Color"/>
            <SliderPicker color={state.secondary} onChange={handleChangeSecondary}/>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSaveColors}>
            <Icon name="checkmark"/> Save Colors
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove"/> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  )
};

export default connect(null, { setColors })(ColorPanel);