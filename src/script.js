import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCviaYW79vbuEzyLGlVP5OK8irS_yVHmxk",
    authDomain: "nameage-ec0a2.firebaseapp.com",
   databaseURL: "https://nameage-ec0a2-default-rtdb.asia-southeast1.firebasedatabase.app",
   projectId: "nameage-ec0a2",
    storageBucket: "nameage-ec0a2.firebasestorage.app",
   messagingSenderId: "72793368901",
   appId: "1:72793368901:web:55e93af625bf0c9193362c"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 폼 제출 버튼 클릭 시
document.getElementById('submitButton').addEventListener('click', function() {
    const product = document.getElementById('product').value;
    const size = document.getElementById('size').value;
    const type = document.getElementById('type').value;
    const stockAmount = document.getElementById('stockAmount').value;
    const neededAmount = document.getElementById('neededAmount').value;

    // 유효성 검사
    if (stockAmount && neededAmount) {
        // Firebase에 재고 데이터 저장
        updateStockData(product, size, type, stockAmount, neededAmount);
    } else {
        alert('모든 필드를 입력해주세요.');
    }
});

// Firebase에 재고 데이터 업데이트
const updateStockData = (product, size, type, stockAmount, neededAmount) => {
    const stockItemRef = ref(db, `stocks/${product}/${size}/${type}`);
    set(stockItemRef, { stockAmount, neededAmount })
        .then(() => console.log('Stock updated successfully'))
        .catch((error) => console.error('Error updating stock:', error));
};

// Firebase에서 재고 데이터 불러오기
const stockRef = ref(db, 'stocks');
onValue(stockRef, (snapshot) => {
    const data = snapshot.val();
    updateStockTable(data);
});

// 테이블 업데이트 함수
const updateStockTable = (data) => {
    const tableBody = document.getElementById('stockTable').querySelector('tbody');
    tableBody.innerHTML = ''; // 테이블 초기화

    for (const product in data) {
        for (const size in data[product]) {
            for (const type in data[product][size]) {
                const stockItem = data[product][size][type];
                const row = tableBody.insertRow();

                row.innerHTML = `
                    <td>${product}</td>
                    <td>${size}</td>
                    <td>${type}</td>
                    <td>${stockItem.stockAmount}</td>
                    <td>${stockItem.neededAmount}</td>
                `;
            }
        }
    }
};
