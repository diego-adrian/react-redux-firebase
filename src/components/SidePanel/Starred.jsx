import React, { useState } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';

const Starred = () => {
  
  const [state, setState] = useState({
    activeChannel: '',
    starredChannels: []
  });
  
  const setActiveChannel = channel => {
    setState(state => ({
      ...state,
      activeChannel: channel ? channel.id : ''
    }))
  };

  const handleCurrentChannel = channel => {
    setActiveChannel(channel);
    setCurrentChannel(channel);
    setPrivateChannel(false);
  };
  
  const DisplayChannels = () => (
    state.starredChannels.length > 0 && state.starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => handleCurrentChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    )
    )
  );
  return (
    <Menu.Menu style={{ paddingBottom: '2em' }}>
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
            </span>{" "}
        ({state.starredChannels.length})
      </Menu.Item>
      <DisplayChannels />
    </Menu.Menu>
  );
}


export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);