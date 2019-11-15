import React, { useEffect } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import firebase from '../firebase';
import App from '../components/App';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const Pages = props => {
  useEffect(() => {
    const autenticated = async() => {
      try {
        await firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            props.history.push('/');
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    autenticated();
  }, [props.history]);
  return(
    <Switch>
      <Route path="/" exact component={App}></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/register" component={Register}></Route>
    </Switch>
  )
}

export default withRouter(Pages);