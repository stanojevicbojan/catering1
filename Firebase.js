import * as firebase from 'firebase'
import firestore from 'firebase/firestore'


const config = {
    /* FIREBASE CONFIG */
  };

  if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

firebase.firestore().settings(settings);

export default firebase;
