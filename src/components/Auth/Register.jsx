import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

const Register = () => {

  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const handleSubmit = async(event) => {
    try {
      event.preventDefault();
      const createdUser = await firebase.auth().createUserWithEmailAndPassword(formState.email, formState.password);
      console.log(createdUser);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      [event.target.name]: event.target.value || ''
    }))
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450}}>
        <Header as="h3" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange">
            Register for DevChat
          </Icon>
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="username" onChange={handleChange} type="text" value={formState.username}></Form.Input>
            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email address" onChange={handleChange} type="email" value={formState.email}></Form.Input>
            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="password" onChange={handleChange} type="password" value={formState.password}></Form.Input>
            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="password confirmation" onChange={handleChange} type="password" value={formState.passwordConfirmation}></Form.Input>
            <Button color="orange" fluid size="large">Submit</Button>
          </Segment>
        </Form>
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
};

export default Register;