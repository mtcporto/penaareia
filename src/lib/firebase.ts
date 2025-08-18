
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "p-na-areia-sales-flow",
  "appId": "1:1055222190284:web:335c039597b89e560a7269",
  "storageBucket": "p-na-areia-sales-flow.firebasestorage.app",
  "apiKey": "AIzaSyBHayrBLzTFzU31XKNYqTdMaBC8ZQtOPw4",
  "authDomain": "p-na-areia-sales-flow.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1055222190284"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
