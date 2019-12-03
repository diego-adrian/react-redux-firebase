/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../firebase';
import App from '../components/App';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Spinner from '../Spinner';
import { setUser, clearUser } from '../actions';

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const Pages = props => {
  useEffect(() => {
    console.log('==================USE EFFECT ===================');
    console.log(props);
    console.log('==================USE EFFECT ===================');
    const autenticated = async() => {
      try {
        await firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            props.setUser(user);
            props.history.push('/');
          } else {
            props.history.push('/login');
            props.clearUser();
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    autenticated();
    return () => {
      console.log('UNMOUNT');
    };
  }, []);
  return(
    props.isLoading ? <Spinner message="Preparing chat..."/> : 
    <Switch>
      <Route path="/" exact component={App}></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/register" component={Register}></Route>
    </Switch>
  )
}

export default withRouter(connect(mapStateFromProps, { setUser, clearUser })(Pages));