import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import { connect } from 'react-redux';
import './App.css';

const App = ({ currentChannel, currentUser }) => {
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
        currentChannel={currentChannel} currentUser={currentUser}/>
      </Grid.Column>
      <Grid.Column style={{ width: 4}}>
        <MetaPanel/>
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = ({ channel, user }) => ({
  currentChannel: channel.currentChannel,
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(App);
