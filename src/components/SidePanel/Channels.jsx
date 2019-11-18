import React, { useState } from 'react';
import {Menu, Icon} from 'semantic-ui-react';

const Channels = () => {
  const [state, setState] = useState({
    channels: []
  });
  return(
    <Menu.Menu style={{ paddingBottom: '2em'}}>
      <Menu.Item>
        <span>
          <Icon name="exchange"/> CHANNELS
        </span>{" "}
        ({state.channels.length}) <Icon name="add"/>
      </Menu.Item>
    </Menu.Menu>
  )
};

export default Channels;