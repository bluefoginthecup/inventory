//---------탭 관련 시작 ---------

// dom으로 감싸기 + 탭 전환 기능
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchTab').addEventListener('click', function() {
        activateTab('searchSection');
    });

    document.getElementById('inputTab').addEventListener('click', function() {
        activateTab('inputSection');
    });

    document.getElementById('allStockTab').addEventListener('click', function() {
        activateTab('allStockSection');
    });
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
// Firebase 설정 및 초기화
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, query, onValue, remove } from "firebase/database";
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

// 제품 검색 기능
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm) {
        searchProducts(searchTerm);
    }
});

function searchProducts(searchTerm) {
    const productsRef = ref(db, 'stocks');
    const productQuery = query(productsRef);

    onValue(productQuery, (snapshot) => {
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

//----------섹션 2 (재고 입력)------------

// 제출 버튼 클릭 시
document.getElementById('submitButton').addEventListener('click', function() {
    const product = document.getElementById('product').value; 
    const size = document.getElementById('size').value;       
    const type = document.getElementById('type').value;     
    const stockAmount = parseInt(document.getElementById('stockAmount').value);  
    const neededAmount = parseInt(document.getElementById('neededAmount').value);  

    if (product && size && type && !isNaN(stockAmount) && !isNaN(neededAmount)) {
        saveStockData(product, size, type, stockAmount, neededAmount);
    } else {
        alert('모든 필드를 입력해주세요.');
    }
});

// Firebase에 재고 데이터 저장
function saveStockData(product, size, type, stockAmount, neededAmount) {
    const productRef = ref(db, 'stocks/' + product + '/' + size + '/' + type); 
     set(productRef, {
        stockAmount: stockAmount,  
        neededAmount: neededAmount  
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

    // 테이블 셀 클릭 시 수정 가능하게 만들기
document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('allStockTable');
 
     table.addEventListener('click', function(event) {
        const cell = event.target;
        
        if (cell.classList.contains('editable')) {
            const currentValue = cell.textContent;
            const fieldName = cell.dataset.field;  

            // 입력 필드로 바꾸기
            const inputField = document.createElement('input');
            inputField.value = currentValue;
            cell.textContent = '';
            cell.appendChild(inputField);

            inputField.addEventListener('blur', function() {
                const newValue = inputField.value;
                cell.textContent = newValue;

                // Firebase에서 데이터 업데이트 (기존 데이터 덮어쓰기)
                const row = cell.closest('tr');
                const product = row.querySelector('[data-field="product"]').textContent;
                const size = row.querySelector('[data-field="size"]').textContent;
                const type = row.querySelector('[data-field="type"]').textContent;
                const db = getDatabase();
                const productRef = ref(db, `stocks/${product}/${size}/${type}`);
                
               
                 const currentData = {
                    stockAmount: row.querySelector('[data-field="stockAmount"]').textContent,
                    neededAmount: row.querySelector('[data-field="neededAmount"]').textContent
                };

               
                set(productRef, {
                    ...currentData,  
                    [fieldName]: newValue
                }).then(() => {
                    console.log(`Updated ${fieldName} to ${newValue}`);
                }).catch((error) => {
                    console.error("Update failed:", error);
                });
            });
        }
    });

// 삭제 버튼 클릭 시 데이터 Firebase에서 제거 
table.addEventListener('click', function(event) {
    const button = event.target;
    
    if (button.classList.contains('delete-btn')) {
        const row = button.closest('tr');
        const product = row.querySelector('[data-field="product"]').textContent;
        const size = row.querySelector('[data-field="size"]').textContent;
        const type = row.querySelector('[data-field="type"]').textContent;
        row.remove(); 
        const db = getDatabase();
        const productRef = ref(db, `stocks/${product}/${size}/${type}`);
        
        // Firebase에서 데이터 삭제
        remove(productRef).then(() => {
            console.log(`Deleted data for ${product} ${size} ${type}`);
            row.remove(); 
        }).catch((error) => {
            console.error("Delete failed:", error);
        });

    }
    });
});


// 전체 재고 테이블 업데이트
function updateAllStockTable(products) {
    const tableBody = document.getElementById('allStockTable').querySelector('tbody');
    tableBody.innerHTML = ''; 

    if (products.length === 0) {
        const noResultsRow = tableBody.insertRow();
        const cell = noResultsRow.insertCell(0);
        cell.colSpan = 7;
        cell.textContent = "전체 재고가 없습니다.";
        return;
    }

    products.forEach((product) => {        
        const productName = Object.keys(product)[0];
        const productNameKorean = convertToKorean(productName); 
        for (const size in product[productName]) {
          
                for (const type in product[productName][size]) {
                    if (product[productName][size].hasOwnProperty(type)) {
                        const stockItem = product[productName][size][type];
                        const row = tableBody.insertRow();
                        row.innerHTML = `
                            <td class="editable" data-field="product">${productNameKorean}</td>
                            <td class="editable" data-field="size">${convertToKorean(size)}</td>
                            <td class="editable" data-field="type">${convertToKorean(type)}</td>
                            <td class="editable" data-field="stockAmount">${stockItem.stockAmount}</td>
                            <td class="editable" data-field="neededAmount">${stockItem.neededAmount}</td>
                            <td><button class="edit-btn">수정</button></td>
                            <td><button class="delete-btn">삭제</button></td>
                `;               
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
         
        if (data === null) {
            console.log("Firebase에서 데이터를 불러오지 못했습니다.");
            return;
        }
        const allProducts = [];

        // 전체 제품 정보 불러오기
        for (const product in data) {
            allProducts.push({[product]: data[product]});
        }

        // 전체 재고 테이블 업데이트
        updateAllStockTable(allProducts);
    
    }, (error) => {
        console.error("Firebase 데이터 로딩 오류:", error);
    });
}

// 페이지가 로드될 때 전체 재고를 불러옴
window.onload = function() {
    loadAllStock();  // Firebase에서 전체 재고를 불러와서 테이블 갱신
};
