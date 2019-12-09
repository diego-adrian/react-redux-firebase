import React, { useState } from 'react';
import { Segment, Accordion, Header, Icon, Image, List } from 'semantic-ui-react';

const MetaPanel = ({ isPrivateChannel, currentChannel, userPosts }) => {

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

  const DisplayTopPosters = () => (
    Object.entries(userPosts).sort((a, b) => b[1]- a[1]).map(([key, val], i) => (
      <List.Item key={i}>
        <Image avatar src={val.avatar}/>
        <List.Content>
          <List.Header as="a">{key}</List.Header>
          <List.Description>{val.count} posts</List.Description>
        </List.Content>
      </List.Item>
    ))
  );

  return (
    isPrivateChannel ? null : (
      <Segment loading={!currentChannel}>
        <Header as="h3" attached="top">
          About # { currentChannel && currentChannel.name }
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
            { currentChannel && currentChannel.details }
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
            <List>
              {
                userPosts && <DisplayTopPosters/>
              }
            </List>
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
            <Header as="h4">
              <Image circular src={currentChannel && currentChannel.createdBy.avatar}/>
              {currentChannel && currentChannel.createdBy.name }
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  )
};

export default MetaPanel;