import React, {Component} from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Label, Icon, Segment } from "semantic-ui-react";
import { HuePicker } from 'react-color';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { setColors } from "../../actions";

class ColorPanel extends Component {

  state = {
    modal: false,
    primary: '',
    secondary: '',
    usersRef: firebase.database().ref('users'),
    user: this.props.currentUser,
    userColors: []
  };

  componentDidMount() {
    if(this.state.user){
      this.addListener(this.state.user.uid)
    }
  }

  componentWillUnmount() {
    this.removeListener()
  }

  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  };

  addListener = userId => {
    let userColors = [];
    this.state.usersRef
      .child(`${userId}/colors`)
      .on('child_added', snap => {
        userColors = [snap.val(),...userColors];
        // console.log(userColors);
        this.setState({userColors})
      })
  };


  handleSaveColors = () => {
    if(this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  };

  saveColors = (primary, secondary) => {
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      .update({
        primary,
        secondary
      })
      .then(() => {
        console.log('Colors Added');
        this.closeModal();
      })
      .catch(err => {
        console.error(err);
      })
  };

  handleChangePrimary = color => this.setState({primary: color.hex});

  handleChangeSecondary = color => this.setState({secondary: color.hex});

  openModal = () => this.setState({modal: true});

  closeModal = () => this.setState({modal: false});

  displayUserColors = colors => (
    colors.length > 0 && colors.map((color,i) => (
      <React.Fragment key={i}>
        <Divider/>
        <div
          className="color__container"
          onClick={() => this.props.setColors(color.primary, color.secondary)}
        >
          <div className="color__square" style={{background: color.primary}}>
            <div className="color__overlay" style={{background: color.secondary}} />
          </div>
        </div>
      </React.Fragment>
    ))
  );

  render() {
    const {modal, primary, secondary, userColors} = this.state;

    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider/>
        <Button icon="add" size="small" color="blue" onClick={this.openModal}/>
        {this.displayUserColors(userColors)}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color"/>
              <HuePicker onChange={this.handleChangePrimary} color={primary} className="color__picker"/>
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color"/>
              <HuePicker onChange={this.handleChangeSecondary} color={secondary} className="color__picker"/>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
              <Icon name="checkmark"/> Save Color
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove"/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default connect(null, {setColors})(ColorPanel);