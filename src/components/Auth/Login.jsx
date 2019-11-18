import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

const Register = () => {

  const [formState, setFormState] = useState({
    values: {
      email: '',
      password: ''
    },
    errors: {
      email: true,
      password: true
    },
    touched: {
      email: false,
      password: false
    },
    userRef: firebase.database().ref('users'),
    messageErrors: [],
    loading: false
  });

  const handleInputError = (errors, filter) => {
    return errors.some(error => error && error.toLowerCase().includes(filter)) ? 'error' : ''
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setFormState(formState => ({
        ...formState,
        messageErrors: [],
        loading: true
      }));
      await firebase.auth().signInWithEmailAndPassword(formState.values.email, formState.values.password);
      setFormState(formState => ({
        ...formState,
        loading: false
      }));
    } catch (error) {
      setFormState(formState => ({
        ...formState,
        loading: false,
        messageErrors: formState.messageErrors.concat(error.message)
      }));
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
        <Header as="h4" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" className="flex">
            Login to DevChat
          </Icon>
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input fluid className={handleInputError(formState.messageErrors, 'email')} error={!formState.errors.email && formState.touched.email} name="email" icon="mail" iconPosition="left" placeholder="Email address" onChange={handleChange} type="email" value={formState.email}></Form.Input>
            <Form.Input fluid className={handleInputError(formState.messageErrors, 'password')} error={!formState.errors.password && formState.touched.password} name="password" icon="lock" iconPosition="left" placeholder="password" onChange={handleChange} type="password" value={formState.password}></Form.Input>
            <Button
              color="violet"
              className={formState.loading ? 'loading' : ''}
              fluid size="large"
              disabled={
                (!formState.errors.email || !formState.touched.email) ||
                (!formState.errors.password || !formState.touched.password)
              }>
              Submit
            </Button>
          </Segment>
        </Form>
        {
          formState.messageErrors.length > 0 && (
            <Message
              error
              header="Errors"
              list={formState.messageErrors}>
            </Message>
          )
        }
        <Message>
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
};

export default Register;