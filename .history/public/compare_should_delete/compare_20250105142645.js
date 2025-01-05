import './script.js';  // /script.js를 Webpack에 포함시켜 번들링
import './styles.css';

// DOMContentLoaded 이벤트를 사용하여 DOM이 완전히 로드된 후에 실행하도록 변경
document.addEventListener('DOMContentLoaded', function() {
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

    // 영어->한글로 번역해서 출력
    const convertToKorean = (name) => {
        const conversionMap = {
            "pedro_ivory": "페드로 아이보리",
            "pedro_gray": "페드로 그레이",
            "pedro_blue": "페드로 블루",
            // 추가적으로 모든 매핑 값을 넣어주세요
        };
        return conversionMap[name] || name;
    };

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

            // 테이블에 검색 결과 표시
            updateSearchTable(filteredProducts);
        });
    }

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
        const productsRef = ref(db, 'stocks');
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const allProducts = [];

            if (data === null) {
                console.log("Firebase에서 데이터를 불러오지 못했습니다.");
                return;
            }

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
});
