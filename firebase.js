/* eslint-disable prettier/prettier */
import firebase from 'firebase';

export const firebaseConfig = {
  apiKey: 'AIzaSyAzzA0GyeLWiWh2d0_E3_hIa6U4hkEZvW0',
  authDomain: 'qandac-4.firebaseapp.com',
  databaseURL: 'https://qandac-4-default-rtdb.firebaseio.com',
  projectId: 'qandac-4',
  storageBucket: 'qandac-4.appspot.com',
  messagingSenderId: '821541752418',
  appId: '1:821541752418:web:b2135960d17cfaea818b3b',
  measurementId: 'G-H375CPT7MP',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export default firebase;
