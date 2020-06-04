// database/firebaseDb.js

import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAEaBCJpzH2ukDwzVJ9PbvjNXHai3TkWL8",
    authDomain: "catering-app-25021.firebaseapp.com",
    databaseURL: "https://catering-app-25021.firebaseio.com",
    projectId: "catering-app-25021",
    storageBucket: "catering-app-25021.appspot.com",
    messagingSenderId: "704821076290",
    appId: "1:704821076290:web:699e0f4c2314c33004e8db",
    measurementId: "G-N570BST9M0"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

firebase.firestore();

export default firebase;