// src/index.js
import './src/script.js';  // /script.js를 Webpack에 포함시켜 번들링
import './styles.css';


import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCviaYW79vbuEzyLGlVP5OK8irS_yVHmxk",
     authDomain: "nameage-ec0a2.firebaseapp.com",
    databaseURL: "https://nameage-ec0a2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nameage-ec0a2",
     storageBucket: "nameage-ec0a2.firebasestorage.app",
    messagingSenderId: "72793368901",
    appId: "1:72793368901:web:55e93af625bf0c9193362c"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

