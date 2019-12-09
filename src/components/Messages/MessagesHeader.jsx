import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({ channel, countUniqueUsers, handleSearchMessages, typing, isPrivateChannel, handleStar, isChannelStarred }) => {
  return(
    <Segment clearing>
      {/* Channel title */}
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0}}>
        <span>
          { channel ? channel.name : '' }
          { !isPrivateChannel && (
            <Icon 
              name={ isChannelStarred ? "star" : "star outline" } 
              onClick={handleStar} 
              color={ isChannelStarred ? "yellow" : "black" }>
              </Icon>
            )}
        </span>
        <Header.Subheader>
          {countUniqueUsers.length > 0 ? `${countUniqueUsers} users` : `${countUniqueUsers} user`}
        </Header.Subheader>
      </Header>
      {/* Channel Seach Input */}
      <Header floated="right">
        <Input
          loading={typing}
          onChange={handleSearchMessages}
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