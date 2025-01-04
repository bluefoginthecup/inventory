//---------탭 관련 시작 ---------

// 탭 전환 기능
document.getElementById('searchTab').addEventListener('click', function() {
    activateTab('searchSection');
});

document.getElementById('inputTab').addEventListener('click', function() {
    activateTab('inputSection');
});

document.getElementById('allStockTab').addEventListener('click', function() {
    activateTab('allStockSection');
});

// 탭 활성화 함수
function activateTab(sectionId) {
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 모든 탭 비활성화
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 해당 섹션 활성화
    document.getElementById(sectionId).classList.add('active');

    // 해당 탭 활성화
    const activeTab = document.getElementById(sectionId.replace('Section', 'Tab'));
    activeTab.classList.add('active');
}
//----------------탭 관련 끝 ---------

//영어->한글로 번역해서 출력

const convertToKorean = (name) => {
    const conversionMap = {
        "pedro_ivory": "페드로 아이보리",
        "pedro_gray": "페드로 그레이",
        "pedro_blue": "페드로 블루",
        "basic": "기본형",
        "winged": "날개형",
        "finished": "완제품",
        "fabric": "원단"
    };
    return conversionMap[name] || name;
};





//---------- 섹션 1 (제품검색) ----------
import { initializeApp } from "firebase/app";
import { getDatabase, ref, query, orderByKey, startAt, endAt, onValue } from "firebase/database";

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

// 검색 버튼 클릭 시
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm) {
        searchProducts(searchTerm);
    }
});

// 제품 검색 기능
function searchProducts(searchTerm) {
    // Firebase에서 검색어에 맞는 데이터를 가져오기 위한 쿼리 작성
    const productsRef = ref(db, 'stocks');
    const productQuery = query(productsRef);

    onValue(productQuery, (snapshot) => {
        const data = snapshot.val();
        const filteredProducts = [];

        // 데이터 필터링: 검색어가 포함된 제품 찾기
        for (const product in data) {
            if (product.toLowerCase().includes(searchTerm)) {  // 대소문자 구분 없이 검색
                filteredProducts.push(data[product]);
            }
        }

        // 테이블에 검색 결과 표시
        updateSearchTable(filteredProducts);
    });
}

// 검색 결과 테이블 업데이트
function updateSearchTable(products) {
    const tableBody = document.getElementById('searchResults').querySelector('tbody');
    tableBody.innerHTML = ''; // 기존 결과 삭제

    if (products.length === 0) {
        const noResultsRow = tableBody.insertRow();
        const cell = noResultsRow.insertCell(0);
        cell.colSpan = 5;
        cell.textContent = "검색 결과가 없습니다.";
        return;
    }

    // 검색된 제품 목록을 테이블에 추가
    products.forEach(product => {
        for (const size in product) {
            for (const type in product[size]) {
                const stockItem = product[size][type];
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${convertToKorean(product)}</td>
                    <td>${convertToKorean(size)}</td>
                    <td>${convertToKorean(type)}</td>
                    <td>${stockItem.stockAmount}</td>
                    <td>${stockItem.neededAmount}</td>
                `;
            }
        }
    });
}
