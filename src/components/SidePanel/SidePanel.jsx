import React from 'react';
import { Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessage from './DirectMessage';

const SidePanel = props => {
  const { user } = props;
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: '#350d36', fontSize: '1.2rem'}}
    >
      <UserPanel user={user}/>
      <Channels user={user}/>
      <DirectMessage user={user}/>
    </Menu>
  )
};

const mapStateToProps = ({ user }) => ({
  user: user.currentUser
});

export default connect(mapStateToProps)(SidePanel);