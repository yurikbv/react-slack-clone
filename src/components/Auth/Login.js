import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  displayErrors = errors => errors.map((item, i) => <p key={i}>{item.message}</p>);

  isFormValid = ({ email, password }) => email || password;

  handleSubmit = event => {
    if (this.isFormValid(this.state)) {
      event.preventDefault();
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedUser => {
          console.log(signedUser);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: [...this.state.errors, err],
            loading: false,
          });
        });
    }
  };

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : null;
  };

  render() {
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to DevChat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputError(errors, 'email')}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputError(errors, 'password')}
              />
              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>

          {errors.length ? (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          ) : null}

          <Message>
            Don't have an account?
            <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
