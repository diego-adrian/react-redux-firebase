import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

const Register = () => {

  const [formState, setFormState] = useState({
    values: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    errors: {
      username: false,
      email: false,
      password: false,
      passwordConfirmation: false
    },
    touched: {
      username: false,
      email: false,
      password: false,
      passwordConfirmation: false
    }
  });

  const validForm = () => {

  } 

  const handleSubmit = async(event) => {
    try {
      event.preventDefault();
      if (validForm) {

      }
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
      values: {
        ...formState.values,
        [event.target.name]: event.target.value || '',
      },
      errors: {
        ...formState.errors,
        [event.target.name]: event.target.value.length === 0 ? true : false,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
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
            <Form.Input fluid error={formState.errors.username && formState.touched.username} name="username" icon="user" iconPosition="left" placeholder="username" onChange={handleChange} type="text" value={formState.username}></Form.Input>
            <Form.Input fluid error={formState.errors.email && formState.touched.email} name="email" icon="mail" iconPosition="left" placeholder="Email address" onChange={handleChange} type="email" value={formState.email}></Form.Input>
            <Form.Input fluid error={formState.errors.password && formState.touched.password} name="password" icon="lock" iconPosition="left" placeholder="password" onChange={handleChange} type="password" value={formState.password}></Form.Input>
            <Form.Input fluid error={formState.errors.passwordConfirmation && formState.touched.passwordConfirmation} name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="password confirmation" onChange={handleChange} type="password" value={formState.passwordConfirmation}></Form.Input>
            <Message
              color="red"
              >
              <Message.Header>Errors</Message.Header>
              <Message.List>
                <Message.Item></Message.Item>
              </Message.List>
            </Message>
            <Button 
            color="orange" 
            fluid size="large" 
            disabled={
              !(formState.errors.username &&
              formState.errors.email &&
              formState.errors.password &&
              formState.errors.passwordConfirmation)
            }>
              Submit
            </Button>
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