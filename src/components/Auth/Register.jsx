import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';

const Register = () => {

  const handleChange = () => {
    console.log(22222)
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450}}>
        <Header as="h3" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange">
            Register for DevChat
          </Icon>
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="username" onChange={handleChange} type="text"></Form.Input>
            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email address" onChange={handleChange} type="email"></Form.Input>
            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="password" onChange={handleChange} type="password"></Form.Input>
            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="password confirmation" onChange={handleChange} type="password"></Form.Input>
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