import React, { useState } from 'react';
import { Segment, Accordion, Header, Icon } from 'semantic-ui-react';

const MetaPanel = ({ isPrivateChannel }) => {

  const [state, setState] = useState({
    activeIndex: 0
  });

  const setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex} = state;
    const newIndex = activeIndex === index ? -1 : index;
    setState(state => ({
      ...state,
      activeIndex: newIndex
    }));
  }

  return (
    isPrivateChannel ? null : (
      <Segment>
        <Header as="h3" attached="top">
          About # Channel
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={state.activeIndex === 0}
            index={0}
            onClick={setActiveIndex}
          >
            <Icon name="dropdown"/>
            <Icon name="info"/>
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={state.activeIndex === 0}>
            details
          </Accordion.Content>

          <Accordion.Title
            active={state.activeIndex === 1}
            index={1}
            onClick={setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Porsters
          </Accordion.Title>
          <Accordion.Content active={state.activeIndex === 1}>
            details
          </Accordion.Content>


          <Accordion.Title
            active={state.activeIndex === 2}
            index={2}
            onClick={setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={state.activeIndex === 2}>
            Creator
          </Accordion.Content>


        </Accordion>
      </Segment>
    )
  )
};

export default MetaPanel;