// database/firebaseDb.js

import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const firebaseConfig = {
    /* FIREBASE CONFIG*/
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

firebase.firestore();

export default firebase;
