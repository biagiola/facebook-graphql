import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAvO3xldbq0_IlRO0oivmtQQqpCicUiMBw",
    authDomain: "facebookpreview-f51b0.firebaseapp.com",
    databaseURL: "https://facebookpreview-f51b0.firebaseio.com",
    projectId: "facebookpreview-f51b0",
    storageBucket: "facebookpreview-f51b0.appspot.com",
    messagingSenderId: "641170722036",
    appId: "1:641170722036:web:879082f515a8cfa4dc22a1"
  };

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()
//const storage = firebase.storage();
//const db = firebase.firestore()

export { auth, provider }
