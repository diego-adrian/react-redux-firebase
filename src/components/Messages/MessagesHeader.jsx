import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({ channel }) => {
  return(
    <Segment clearing>
      {/* Channel title */}
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0}}>
        <span>
          { channel ? channel.name : '' }
          <Icon name={"star outline"} color="black"></Icon>
        </span>
        <Header.Subheader>
          2 Users
        </Header.Subheader>
      </Header>
      {/* Channel Seach Input */}
      <Header floated="right">
        <Input
        size="mini"
        icon="search"
        name="searchTerm"
        placeholder="Search Messages"
        ></Input>
      </Header>
    </Segment>
  )
};

export default MessagesHeader;