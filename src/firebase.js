import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAiEi8v1aXul6sAdFvj1H5wp5HYAGHoFmg",
  authDomain: "react-slack-clone-7317c.firebaseapp.com",
  databaseURL: "https://react-slack-clone-7317c.firebaseio.com",
  projectId: "react-slack-clone-7317c",
  storageBucket: "react-slack-clone-7317c.appspot.com",
  messagingSenderId: "83139131514",
  appId: "1:83139131514:web:c7175bbf0f8b1ea5fda3c3",
  measurementId: "G-GSLHE3HNZK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;