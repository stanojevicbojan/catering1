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

class FireMenu {
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
        let ref = this.ref.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }
    //step 2
    getListsForSummerWeekTwo(callback) {
        let ref = this.refSummerWeekTwo.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }

    getListsForSummerWeekThree(callback) {
        let ref = this.refSummerWeekThree.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }

    getListsForSummerWeekFour(callback) {
        let ref = this.refSummerWeekFour.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }

    getListsForWinterWeekOne(callback) {
        let ref = this.refWinterWeekOne.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }

    getListsForWinterWeekTwo(callback) {
        let ref = this.refWinterWeekTwo.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }

    getListsForWinterWeekThree(callback) {
        let ref = this.refWinterWeekThree.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }

    getListsForWinterWeekFour(callback) {
        let ref = this.refWinterWeekFour.orderBy('sorting')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            menu = []

            snapshot.forEach(doc => {
                menu.push({id: doc.id, ...doc.data() })
            })

            callback(menu)
        })
    }

    addList(list) {
        let ref = this.ref

        ref.add(list)
    }

    updateList(list) {
        let ref = this.ref


        ref.doc(list.id).set(list)
    }

    updateMenu(list) {
        let ref = this.ref

        ref.doc(list.id).set(list)
    }

    //step 3
    updateMenuForSummerWeekTwo(list) {
        let ref = this.refSummerWeekTwo

        ref.doc(list.id).set(list)
    }

    updateMenuForSummerWeekThree(list) {
        let ref = this.refSummerWeekThree

        ref.doc(list.id).set(list)
    }

    updateMenuForSummerWeekFour(list) {
        let ref = this.refSummerWeekThree

        ref.doc(list.id).set(list)
    }

    updateMenuForWinterWeekOne(list) {
        let ref = this.refWinterWeekOne

        ref.doc(list.id).set(list)
    }

    updateMenuForWinterWeekTwo(list) {
        let ref = this.refWinterWeekTwo

        ref.doc(list.id).set(list)
    }

    updateMenuForWinterWeekThree(list) {
        let ref = this.refWinterWeekThree

        ref.doc(list.id).set(list)
    }

    updateMenuForWinterWeekFour(list) {
        let ref = this.refWinterWeekFour

        ref.doc(list.id).set(list)
    }

    get user() {
        return firebase.auth().currentUser.uid
    }

    get ref() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('menu')
    }
// step 1
    get refSummerWeekTwo() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('summerWeekTwo')
    }

    get refSummerWeekThree() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('summerWeekThree')
    }

        get refSummerWeekFour() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('summerWeekFour')
    }

    get refWinterWeekOne() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('winterWeekOne')
    }

    get refWinterWeekTwo() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('winterWeekTwo')
    }

    get refWinterWeekThree() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('winterWeekThree')
    }

    get refWinterWeekFour() {
        return firebase
        .firestore()
        .collection('users')
        .doc('1mXHCyEEYnhyIqiqyeqi')
        .collection('winterWeekFour')
    }

    detach() {
        this.unsubscribe()
    }
        
}



export default FireMenu
