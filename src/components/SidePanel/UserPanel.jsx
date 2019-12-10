import React, { useState } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';
import firebase from '../../firebase';


const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const UserPanel = ({ currentUser, primaryColor}) => {
  
  const [state, setState] = useState({
    modal: false,
    croppedImage: null,
    blob: null,
    avatarEditor: null,
    uploadCroppedImage: null,
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    metadata: {
      contentType: 'image/jpeg'
    }
  });

  const openModal = () => setState(state => ({
    ...state,
    modal: true
  }));

  const closeModal = () => setState(state => ({
    ...state,
    modal: false
  }));

  const handleSignout = async() => {
    try {
      await firebase.auth().signOut();
      console.log('Sign out!!!');
    } catch (error) {
      console.error(error.message);
    }
  };

  const uploadCroppedImage = async() => {
    try {
      const snap = await state.storageRef.child(`avatar/user-${state.userRef.uid}`).put(state.blob, state.metadata);
      const downloadURL = await snap.ref.getDownloadURL();
      setState(state => ({
        ...state,
        uploadCroppedImage: downloadURL
      }));
      changeAvatar(downloadURL);
    } catch (error) {
      console.error(error.messag);
    }
  };

  const changeAvatar = async (downloadURL) => {
    try {
      await state.userRef.updateProfile({
        photoURL: downloadURL
      });
      closeModal();
      await state.usersRef.child(currentUser.uid).update({
        avatar: downloadURL
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleCropImage = () => {
    if (state.avatarEditor) {
      state.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        setState(state => ({
          ...state,
          croppedImage: imageUrl,
          blob
        }));
      })
    }
  };
  
  const handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        setState(state => ({
          ...state,
          previewImage: reader.result
        }));
      })
    }
  };

  const dropdownOptions = user => [
    {
      key: 'user',
      text: <span>Signed in as <strong>{user && user ? user.displayName : ''}</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span onClick={openModal}>Change Avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={handleSignout}>Sign out</span>
    }
  ];
  return (
    <Grid style={{ background: primaryColor}}>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2rem', margin: 0}}>
          <Header inverted floated="left" as="h2">
            <Icon name="code"></Icon>
            <Header.Content>DevChat</Header.Content>
          </Header>
          <Header style={{ padding: '0.25em'}} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={currentUser ? currentUser.photoURL : ''} spaced="right" avatar/>
                  {currentUser ? currentUser.displayName : ''}
                </span>
              } options={dropdownOptions(currentUser)}
              ></Dropdown>
          </Header>
        </Grid.Row>
        {/* Change User Avatar Modal */}
        <Modal basic open={state.modal} onClose={closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              onChange={handleChange}
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {
                    state.previewImage && (
                      <AvatarEditor
                        ref={node => (state.avatarEditor = node)}
                        image={state.previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )
                  }
                </Grid.Column>
                <Grid.Column>
                  {
                    state.croppedImage && (
                      <Image
                        style={{ margin: '3.5em auto'}}
                        width={100}
                        height={100}
                        src={state.croppedImage}
                      />
                    )
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {
              state.croppedImage && 
              <Button color="green" inverted onClick={uploadCroppedImage}>
                <Icon name="save"/> Change Avatar
              </Button>
            }
            <Button color="green" inverted onClick={handleCropImage}>
              <Icon name="image"/> Preview
            </Button>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="remove"/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  )
}

export default connect(mapStateToProps)(UserPanel);