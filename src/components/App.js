import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import './App.css';

function App() {
  return (
    <Grid columns="equal" className="app" style={{ background: '#EEE'}}>
      <ColorPanel/>
      <SidePanel/>
      <Grid.Column style={{ marginLeft: 320}}>
        <Messages/>
      </Grid.Column>
      <Grid.Column style={{ width: 4}}>
        <MetaPanel/>
      </Grid.Column>
    </Grid>
  );
}

export default App;
