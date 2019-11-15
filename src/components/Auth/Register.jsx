import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import md5 from 'md5';
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
    },
    userRef: firebase.database().ref('users'),
    messageErrors: [],
    loading: false
  });

  const validPassword = ({password, passwordConfirmation}) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      setFormState(formState => ({
        ...formState,
        messageErrors: formState.messageErrors.concat('Password less 6 than 6 characters')
      }));
      return false;
    } else if (password !== passwordConfirmation) {
      setFormState(formState => ({
        ...formState,
        messageErrors: formState.messageErrors.concat('Passwords do not match')
      }));
      return false;
    } else {
      return true;
    }
  };

  const handleInputError = (errors, filter) => {
    return errors.some(error => error && error.toLowerCase().includes(filter)) ? 'error': ''
  }

  const saveUser = createUser => {
    return new Promise((res, rej) => {
      try {
        const userCreated = formState.userRef.child(createUser.user.uid).set({
          name: createUser.user.displayName,
          avatar: createUser.user.photoURL
        });
        res(userCreated);
      } catch (error) {
        rej(error.message);
      }
    })
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setFormState(formState => ({
        ...formState,
        messageErrors: [],
        loading: false
      }));
      if (validPassword(formState.values)) {
        setFormState(formState => ({
          ...formState,
          loading: true
        }));
        const createdUser = await firebase.auth().createUserWithEmailAndPassword(formState.values.email, formState.values.password);
        await createdUser.user.updateProfile({
          displayName: formState.values.username,
          photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon` 
        });
        await saveUser(createdUser);
        setFormState(formState => ({
          ...formState,
          loading: false
        }))
      } else {
        return;
      }
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
        <Header as="h4" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange">
            Register for DevChat
          </Icon>
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input fluid error={!formState.errors.username && formState.touched.username} name="username" icon="user" iconPosition="left" placeholder="username" onChange={handleChange} type="text" value={formState.username}></Form.Input>
            <Form.Input fluid className={handleInputError(formState.messageErrors, 'email')} error={!formState.errors.email && formState.touched.email} name="email" icon="mail" iconPosition="left" placeholder="Email address" onChange={handleChange} type="email" value={formState.email}></Form.Input>
            <Form.Input fluid className={handleInputError(formState.messageErrors, 'password')} error={!formState.errors.password && formState.touched.password} name="password" icon="lock" iconPosition="left" placeholder="password" onChange={handleChange} type="password" value={formState.password}></Form.Input>
            <Form.Input fluid className={handleInputError(formState.messageErrors, 'password')} error={!formState.errors.passwordConfirmation && formState.touched.passwordConfirmation} name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="password confirmation" onChange={handleChange} type="password" value={formState.passwordConfirmation}></Form.Input>
            <Button
              color="orange"
              className={formState.loading ? 'loading' : ''}
              fluid size="large"
              disabled={
                (!formState.errors.username || !formState.touched.username) ||
                (!formState.errors.email || !formState.touched.email) ||
                (!formState.errors.password || !formState.touched.password) ||
                (!formState.errors.passwordConfirmation || !formState.touched.passwordConfirmation) || formState.loading
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
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
};

export default Register;