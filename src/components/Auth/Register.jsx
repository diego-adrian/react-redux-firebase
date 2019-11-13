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
      username: true,
      email: true,
      password: true,
      passwordConfirmation: true
    },
    touched: {
      username: false,
      email: false,
      password: false,
      passwordConfirmation: false
    }
  });

  const validPassword = ({password, passwordConfirmation}) => password === passwordConfirmation;

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (validPassword(formState.values)) {
        const createdUser = await firebase.auth().createUserWithEmailAndPassword(formState.values.email, formState.values.password);
        console.log(createdUser);
      } else {
        console.log('Contraseñas no coinciden');
      }
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
        [event.target.name]: event.target.value.length === 0 ? false : true,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }))
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h3" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange">
            Register for DevChat
          </Icon>
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input fluid error={!formState.errors.username && formState.touched.username} name="username" icon="user" iconPosition="left" placeholder="username" onChange={handleChange} type="text" value={formState.username}></Form.Input>
            <Form.Input fluid error={!formState.errors.email && formState.touched.email} name="email" icon="mail" iconPosition="left" placeholder="Email address" onChange={handleChange} type="email" value={formState.email}></Form.Input>
            <Form.Input fluid error={!formState.errors.password && formState.touched.password} name="password" icon="lock" iconPosition="left" placeholder="password" onChange={handleChange} type="password" value={formState.password}></Form.Input>
            <Form.Input fluid error={!formState.errors.passwordConfirmation && formState.touched.passwordConfirmation} name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="password confirmation" onChange={handleChange} type="password" value={formState.passwordConfirmation}></Form.Input>
            <Button
              color="orange"
              fluid size="large"
              disabled={
                (!formState.errors.username || !formState.touched.username) ||
                (!formState.errors.email || !formState.touched.email) ||
                (!formState.errors.password || !formState.touched.password) ||
                (!formState.errors.passwordConfirmation || !formState.touched.passwordConfirmation)
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