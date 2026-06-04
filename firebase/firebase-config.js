import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey:
  "AIzaSyBq6uRJyEYYnUgG9UvMiiuiMnKFUWTCBwA",

  authDomain:
  "boalkhali-ride.firebaseapp.com",

  projectId:
  "boalkhali-ride",

  storageBucket:
  "boalkhali-ride.firebasestorage.app",

  messagingSenderId:
  "402070789951",

  appId:
  "1:402070789951:web:257b019a63c7caaf267d8a"

};

const app =
initializeApp(firebaseConfig);

export const auth =
getAuth(app);

export const db =
getFirestore(app);

export const ADMIN_EMAIL =
"rahul@work.com";

export const FIXED_FARE =
100;

export const COLLECTIONS = {

  USERS:
  "users",

  DRIVERS:
  "drivers",

  RIDES:
  "rides"

};