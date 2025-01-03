
 // Import the functions you need from the SDKs you need
// Firebase 모듈 가져오기
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCviaYW79vbuEzyLGlVP5OK8irS_yVHmxk",
  authDomain: "nameage-ec0a2.firebaseapp.com",
  databaseURL: "https://nameage-ec0a2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nameage-ec0a2",
  storageBucket: "nameage-ec0a2.firebasestorage.app",
  messagingSenderId: "72793368901",
  appId: "1:72793368901:web:55e93af625bf0c9193362c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



document.getElementById('submitButton').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    if (name && age) {
        // 테이블에 데이터 추가
        const tableBody = document.getElementById('dataTable').querySelector('tbody');
        const newRow = document.createElement('tr');
        const rowNumber = tableBody.rows.length + 1; // 현재 행 개수 + 1이 번호

        newRow.innerHTML = `<td>${rowNumber}</td><td>${name}</td><td>${age}</td>`;
        tableBody.appendChild(newRow);

         // Firebase에 데이터 저장 
        
         const userRef = ref(db, 'users');
         push(userRef, { name, age })
             .then(() => console.log('Data saved to Firebase'))
             .catch(error => console.error('Firebase Error:', error));

        // 입력 필드 초기화
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
    } else {
        alert('모든 필드를 입력해주세요.');
    }
});
