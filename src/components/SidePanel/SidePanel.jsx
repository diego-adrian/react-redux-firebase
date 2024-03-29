import React from 'react';
import { Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessage from './DirectMessage';
import Starred from './Starred';

const SidePanel = ({ user, primaryColor }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: primaryColor, fontSize: '1.2rem'}}
    >
      <UserPanel primaryColor={primaryColor} user={user}/>
      <Starred user={user}/>
      <Channels user={user}/>
      <DirectMessage user={user}/>
    </Menu>
  )
};

const mapStateToProps = ({ user }) => ({
  user: user.currentUser
});

export default connect(mapStateToProps)(SidePanel);