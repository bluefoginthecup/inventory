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
        "erica_white": "에리카 화이트",
        "erica_navy": "에리카 네이비",
        "erica_beige": "에리카 베이지",
        "dotori_white": "도토리 화이트",
        "dotori_coffee": "도토리 커피",
        "rouen_gray": "루앙 그레이",  
        "rouen_beige": "루앙 베이지", 
        "rouen_gold": "루앙 골드",   
        "rouen_pink": "루앙 핑크",   
        "encia_white": "엔시아 화이트", 
        "encia_orange": "엔시아 오렌지", 
        "sobok_white": "소복소복 화이트",
        "sobok_gray": "소복소복 그레이",
        "sobok_indipink": "소복소복 인디핑크",
        "lavender_gold": "라벤더 골드",
        "iris_blue": "아이리스 블루",
        "tatiana_rose": "타티아나 로즈", 
        "ronze_gray": "론즈 연회색",  
        "magritte_gray": "마그리트 연회색",  
        "magritte_denim": "마그리트 데님", 
        "magritte_beige": "마그리트 베이지", 
        "thistle_gray": "엉겅퀴 연회색",  
        "thistle_denim": "엉겅퀴 데님", 
        "thistle_kahki": "엉겅퀴 쑥색", 
        "30x50_cushion": "30x50 쿠션",
        "40_cushion": "40 쿠션",
        "50_cushion": "50 쿠션",
        "45_basic": "45 기본형",
        "50_basic": "50 기본형",
        "50_frame": "50 액자형",
        "60_basic": "60 기본형",
        "45_winged": "45 날개형",
        "50_winged": "50 날개형",
        "hexagon_hanger": "육각형 등걸이",
        "rectangle_hanger": "직사각 등걸이",
        "frame_hanger": "액자형 등걸이",
        "50_basic_back": "50 기본형 뒷지",
        "45_winged_back": "45 날개형 뒷지",
        "50_winged_back": "50 날개형 뒷지",
        "finished": "완제품",
        "embroidery": "자수물",
        "cutting": "재단물",
        "loose": "낱마",
        "cut": "절"

    };
    return conversionMap[name] || name;
};





//---------- 섹션 1 (제품검색) ----------
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, query, push, orderByKey, startAt, endAt, onValue } from "firebase/database";

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

//----------섹션 2 (재고 입력)------------

// 변동량 선택: 재고 추가 / 출고
let isAddingStock = true;  // 기본값은 재고 추가

// 재고 추가 버튼 클릭
document.getElementById('addChange').addEventListener('click', function() {
    isAddingStock = true;
    document.getElementById('stockChange').setAttribute('placeholder', '추가할 수량 입력');
});

// 출고 버튼 클릭
document.getElementById('subtractChange').addEventListener('click', function() {
    isAddingStock = false;
    document.getElementById('stockChange').setAttribute('placeholder', '출고할 수량 입력');
});

// Firebase에서 변동 기록을 테이블에 표시하기
function loadStockChangeHistory(product, size, type) {
    const stockRef = ref(db, 'stocks/' + product + '/' + size + '/' + type + '/changes');
    onValue(stockRef, (snapshot) => {
        const data = snapshot.val();
        const tableBody = document.getElementById('stockChangeHistory').querySelector('tbody');
        tableBody.innerHTML = ''; // 기존 결과 삭제

        if (data) {
            // 변동 기록 데이터를 테이블에 추가
            for (const key in data) {
                const changeRecord = data[key];
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${changeRecord.date}</td>
                    <td>${changeRecord.change}</td>
                `;
            }
        } else {
            // 변동 기록이 없으면 "없음" 표시
            const noResultsRow = tableBody.insertRow();
            const cell = noResultsRow.insertCell(0);
            cell.colSpan = 2;
            cell.textContent = "변동 기록이 없습니다.";
        }
    });
}

// 제출 버튼 클릭 시
document.getElementById('submitButton').addEventListener('click', function() {
    const product = document.getElementById('product').value;  // 방석 종류
    const size = document.getElementById('size').value;        // 사이즈
    const type = document.getElementById('type').value;        // 재고 종류
    const stockAmount = parseInt(document.getElementById('stockAmount').value);  // 현재 재고
    const neededAmount = parseInt(document.getElementById('neededAmount').value);  // 생산 필요량 
    const stockChange = parseInt(document.getElementById('stockChange').value);  // 재고 변동량
     const stockDate = document.getElementById('stockDate').value;
    const change = isAddingStock ? stockChange : -stockChange;
      
    // 필수 필드가 모두 입력되었는지 확인
    if (!product || !size || !type) {
        alert('디자인, 사이즈/품목, 재고 종류는 필수로 입력해야 합니다.');
        return; 
    }

    // 재고, 생산 필요량, 변동량 중 하나라도 입력되었는지 확인
    if (isNaN(stockAmount) && isNaN(neededAmount) && isNaN(stockChange)) {
        alert('현재 재고, 생산 필요량, 또는 재고 변동량 중 하나는 입력해야 합니다.');
        return;  // 셋 중 하나라도 입력되지 않으면 제출되지 않도록 종료
    }

   
      saveStockData(product, size, type, stockAmount, neededAmount, change, stockDate);
});

// Firebase에 재고 데이터 저장 함수
function saveStockData(product, size, type, stockAmount, neededAmount, change, stockDate) {
    const productRef = ref(db, 'stocks/' + product + '/' + size + '/' + type); 
    
    // 재고 수량 업데이트
    set(productRef, {
        stockAmount: stockAmount + change,  // 업데이트된 재고
        neededAmount: neededAmount,
        stockDate: stockDate  // 날짜 추가
    })
    .then(() => {
        alert('재고 정보가 저장되었습니다.');
        document.getElementById('stockForm').reset();  // 폼 초기화
    })
    .catch((error) => {
        console.error('데이터 저장 실패:', error);
        alert('재고 정보를 저장하는데 실패했습니다.');
    });
}



// 섹션 3에서 재고 데이터 표시 (날짜 포함)
function updateAllStockTable(products) {
    const tableBody = document.getElementById('allStockTable').querySelector('tbody');
    tableBody.innerHTML = ''; // 기존 결과 삭제

    if (products.length === 0) {
        const noResultsRow = tableBody.insertRow();
        const cell = noResultsRow.insertCell(0);
        cell.colSpan = 6;
        cell.textContent = "전체 재고가 없습니다.";
        return;
    }

    // 전체 재고 목록을 테이블에 추가
    products.forEach((product) => {        
        const productName = Object.keys(product)[0];
        const productNameKorean = convertToKorean(productName);  // 제품명 한글로 변환
        for (const size in product[productName]) {
            if (product[productName].hasOwnProperty(size)) {
                // size의 각 타입별로 순회 
                for (const type in product[productName][size]) {
                    if (product[productName][size].hasOwnProperty(type)) {
                        const stockItem = product[productName][size][type];
                        const row = tableBody.insertRow();
                        row.innerHTML = `
                            <td>${productNameKorean}</td>
                            <td>${convertToKorean(size)}</td>
                            <td>${convertToKorean(type)}</td>
                            <td>${stockItem.stockAmount}</td>
                            <td>${stockItem.neededAmount}</td>
                            <td>${stockItem.stockDate}</td> 
                `;
                }
            }
        }
    }
});
}

// Firebase에서 전체 재고 정보 불러오기
function loadAllStock() {
    const productsRef = ref(db, 'stocks'); // Firebase에서 재고 정보 가져오기
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        const allProducts = [];

        // 전체 제품 정보 불러오기
        for (const product in data) {
            allProducts.push({[product]: data[product]});
        }

        // 테이블에 전체 재고 표시
        updateAllStockTable(allProducts);
    });
}

// 페이지가 로드될 때 전체 재고를 불러옴
window.onload = function() {
    loadAllStock();
};

