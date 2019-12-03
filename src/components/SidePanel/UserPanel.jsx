import React from 'react';
import { Grid, Header, Icon, Dropdown, Image} from 'semantic-ui-react';
import { connect } from 'react-redux';
import firebase from '../../firebase';

const handleSignout = async() => {
  try {
    await firebase.auth().signOut();
    console.log('Sign out!!!');
  } catch (error) {
    console.error(error.message);
  }
}

const dropdownOptions = user => [
  {
    key: 'user',
    text: <span>Signed in as <strong>{user && user ? user.displayName : ''}</strong></span>,
    disabled: true
  },
  {
    key: 'avatar',
    text: <span>Change Avatar</span>
  },
  {
    key: 'signout',
    text: <span onClick={handleSignout}>Sign out</span>
  }
];

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const UserPanel = ({ currentUser}) => {
  return (
    <Grid style={{ background: '#350d36'}}>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2rem', margin: 0}}>
          <Header inverted floated="left" as="h2">
            <Icon name="code"></Icon>
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>
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
      </Grid.Column>
    </Grid>
  )
}

export default connect(mapStateToProps)(UserPanel);