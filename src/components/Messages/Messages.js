import React, {Component} from 'react';
import { Segment, Comment} from "semantic-ui-react";
import firebase from '../../firebase';
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends Component {

  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: false,
    progressBar: false,
    numberUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: []
  };

  componentDidMount() {
    const { channel, user} = this.state;
    if(channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on('child_added',snap => {
      loadedMessages = [...loadedMessages, snap.val()];
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    })
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc,message) => {
      if(!acc.includes(message.user.name)) {
        acc = [...acc,message.user.name]
      }
      return acc;
    },[]);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numberUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({numberUniqueUsers})
  };

  displayMessages = messages => (
    messages.length > 0 && messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ))
  );

  isProgressBarVisible = percent => {
    if(percent > 0) {
      this.setState({progressBar: true})
    }
  };

  handleSearchChange = event => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages())
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if(
        (message.content && message.content.match(regex))
        || message.user.name.match(regex))
      {
        acc = [...acc,message];
      }
      return acc;
    },[]);
    this.setState({searchResults});
    setTimeout(() => this.setState({searchLoading: false}),500);
  };

  displayChannelName = channel => channel ? `#${channel.name}` : '';

  render() {

    const {
      messagesRef,
      channel,
      user,
      messages,
      progressBar,
      numberUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading
    } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numberUniqueUsers={numberUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
        />
        <Segment>
          <Comment.Group className={progressBar ? 'messages_progress' : 'messages'}>
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          currentChannel={channel}
          currentUser={user}
          messagesRef={messagesRef}
          isProgressBarVisible={this.isProgressBarVisible}
        />
      </React.Fragment>
    );
  }
}

export default Messages;