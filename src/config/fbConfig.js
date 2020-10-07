import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage' 


var config = {
    apiKey: "AIzaSyCPUreeodJGGhj2NSWEp5mYed7WB9J69a4",
    authDomain: "ridesharepwa-ed714.firebaseapp.com",
    databaseURL: "https://ridesharepwa-ed714.firebaseio.com",
    projectId: "ridesharepwa-ed714",
    storageBucket: "ridesharepwa-ed714.appspot.com",
    messagingSenderId: "939284105760",
    appId: "1:939284105760:web:f7ffbd6c77871ee4054a45"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
  firebase.firestore().settings({timestampsInSnapshots:true});
  const storage = firebase.storage();


  export { storage, firebase as default};