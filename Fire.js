import firebase from 'firebase'
import '@firebase/firestore'

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

class Fire {
    constructor(callback) {
        this.init(callback)
    }
    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user)
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch( error => {
                        callback(error)
                    })
            }
        })
    }

    getLists(callback) {
        let ref = this.ref.orderBy('name')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []

            snapshot.forEach(doc => {
                lists.push({id: doc.id, ...doc.data() })
            })

            callback(lists)
        })
    }

    addList(list) {
        let ref = this.ref

        ref.add(list)
    }

    updateList(list) {
        let ref = this.ref

        ref.doc(list.id).update(list)
    }

    get user() {
        return firebase.auth().currentUser.uid
    }

    get ref() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('lists')
    }

    detach() {
        this.unsubscribe()
    }
        
}



export default Fire
