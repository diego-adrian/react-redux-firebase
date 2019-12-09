import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import { connect } from 'react-redux';
import './App.css';

const App = ({ currentChannel, currentUser, isPrivateChannel, userPosts }) => {
  return (
    <Grid columns="equal" className="app" style={{ background: '#EEE'}}>
      <ColorPanel/>
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />
      <Grid.Column style={{ marginLeft: 320}}>
        <Messages
        key={currentChannel && currentChannel.id} 
        currentChannel={currentChannel} 
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column style={{ width: 4}}>
        <MetaPanel 
          currentChannel={currentChannel}
          userPosts={userPosts}
          key={ currentChannel && currentChannel.id }
          isPrivateChannel={isPrivateChannel}/>
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = ({ channel, user }) => ({
  currentChannel: channel.currentChannel,
  currentUser: user.currentUser,
  isPrivateChannel: channel.isPrivateChannel,
  userPosts: channel.userPosts
});

export default connect(mapStateToProps)(App);
