import './script.js';  // /script.js를 Webpack에 포함시켜 번들링
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
const db = getDatabase(app);

// 탭 전환
document.getElementById('searchTab').addEventListener('click', function() {
    activateTab('searchSection');
});

document.getElementById('movementTab').addEventListener('click', function() {
    activateTab('movementSection');
});

document.getElementById('allStockTab').addEventListener('click', function() {
    activateTab('allStockSection');
});

function activateTab(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');
    const activeTab = document.getElementById(sectionId.replace('Section', 'Tab'));
    activeTab.classList.add('active');
}

// 입고/출고 처리 함수
function updateStockMovement(stockDate, product, size, type, incomingAmount, outgoingAmount) {
    const productRef = ref(db, 'stocks/' + stockDate + '/' + product + '/' + size + '/' + type);

    onValue(productRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const currentStock = data.currentStock;  // 기존 재고
            const incoming = data.incoming || 0;  // 기존 입고
            const outgoing = data.outgoing || 0;  // 기존 출고
            const neededAmount = data.neededAmount;  // 생산 필요량

            const newIncoming = incoming + incomingAmount;  // 입고 수량 갱신
            const newOutgoing = outgoing + outgoingAmount;  // 출고 수량 갱신
            const remainingStock = currentStock + newIncoming - newOutgoing;  // 남은 재고 계산

            set(productRef, {
                currentStock: currentStock,  // 기존 재고
                incoming: newIncoming,  // 입고 수량
                outgoing: newOutgoing,  // 출고 수량
                remainingStock: remainingStock,  // 남은 재고
                neededAmount: neededAmount  // 생산 필요량
            })
            .then(() => {
                alert('재고 정보가 갱신되었습니다.');
            })
            .catch((error) => {
                console.error('재고 정보 갱신 실패:', error);
                alert('재고 정보 갱신에 실패했습니다.');
            });
        } else {
            console.log('해당 제품에 대한 재고 정보가 없습니다.');
        }
    });
}

// 입고/출고 처리 버튼 클릭
document.getElementById('submitMovementButton').addEventListener('click', function() {
    const stockDate = document.getElementById('stockDate').value;
    const product = document.getElementById('product').value;
    const size = document.getElementById('size').value;
    const type = document.getElementById('type').value;
    const incomingAmount = parseInt(document.getElementById('incomingAmount').value);
    const outgoingAmount = parseInt(document.getElementById('outgoingAmount').value);

    if (stockDate && product && size && type && !isNaN(incomingAmount) && !isNaN(outgoingAmount)) {
        updateStockMovement(stockDate, product, size, type, incomingAmount, outgoingAmount);
    } else {
        alert('모든 필드를 입력해주세요.');
    }
});

// 검색 기능 (기존 코드)
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm) {
        searchProducts(searchTerm);
    }
});

function searchProducts(searchTerm) {
    const productsRef = ref(db, 'stocks');
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        const filteredProducts = [];

        for (const product in data) {
            if (product.toLowerCase().includes(searchTerm)) {
                filteredProducts.push(data[product]);
            }
        }

        updateSearchTable(filteredProducts);
    });
}

function updateSearchTable(products) {
    const tableBody = document.getElementById('searchResults').querySelector('tbody');
    tableBody.innerHTML = '';

    if (products.length === 0) {
        const noResultsRow = tableBody.insertRow();
        const cell = noResultsRow.insertCell(0);
        cell.colSpan = 5;
        cell.textContent = "검색 결과가 없습니다.";
        return;
    }

    products.forEach(product => {
        for (const size in product) {
            for (const type in product[size]) {
                const stockItem = product[size][type];
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td></td>
                    <td>${convertToKorean(size)}</td>
                    <td>${convertToKorean(type)}</td>
                    <td>${stockItem.stockAmount}</td>
                    <td>${stockItem.neededAmount}</td>
                `;
            }
        }
    });
}

// 한글로 변환 함수 (기존 코드)
const convertToKorean = (name) => {
    const conversionMap = {
        // 영어 -> 한글 변환
    };
    return conversionMap[name] || name;
};
