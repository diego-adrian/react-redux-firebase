import React, { Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

const Messages = () => {
  return (
    <Fragment>
      <MessagesHeader/>
      <Segment style={{ marginRight: 0, paddingRight: 0}}>
        <Comment.Group className="messages">
        </Comment.Group>
      </Segment>
      <MessageForm/>
    </Fragment>
  )
};

const mapStateToProps = ({ user }) => ({
  user: user.currentUser
});

export default connect(mapStateToProps)(Messages);