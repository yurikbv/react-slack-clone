import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let config = {
  apiKey: "AIzaSyAr5SV_tCjXalk9rmqfiXbnoP_UvicC5Jo",
  authDomain: "react-slack-51a2a.firebaseapp.com",
  databaseURL: "https://react-slack-51a2a.firebaseio.com",
  projectId: "react-slack-51a2a",
  storageBucket: "react-slack-51a2a.appspot.com",
  messagingSenderId: "253425055268"
};
firebase.initializeApp(config);

export default firebase;