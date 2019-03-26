import React, {Component} from 'react';
import { Segment, Input, Icon, Header} from "semantic-ui-react";

class MessagesHeader extends Component {
  render() {

    const { channelName, numberUniqueUsers, handleSearchChange, searchLoading } = this.props;

    return (
      <Segment clearing>
        {/*Channel Title*/}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0}}>
          <span>
            {channelName}
            <Icon name="star outline" color="black"/>
          </span>
          <Header.Subheader> {numberUniqueUsers} </Header.Subheader>
        </Header>

        {/*Channel search input*/}
        <Header floated="right">
          <Input
            loading={searchLoading}
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;