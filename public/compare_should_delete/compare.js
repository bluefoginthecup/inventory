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
    const stockDate = document.getElementById('stockDate').value;  // 날짜 (사용자가 입력한 날짜)

    const change = isAddingStock ? stockChange : -stockChange;

    // 필수 필드가 모두 입력되었는지 확인
    if (!product || !size || !type) {
        alert('디자인, 사이즈/품목, 재고 종류는 필수로 입력해야 합니다.');
        return;  // 필수 항목이 비어 있으면 제출되지 않도록 종료
    }

    // 재고, 생산 필요량, 변동량 중 하나라도 입력되었는지 확인
    if (isNaN(stockAmount) && isNaN(neededAmount) && isNaN(stockChange)) {
        alert('현재 재고, 생산 필요량, 또는 재고 변동량 중 하나는 입력해야 합니다.');
        return;  // 셋 중 하나라도 입력되지 않으면 제출되지 않도록 종료
    }

    // 재고 데이터 저장
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
        cell.colSpan = 6;  // 6개 컬럼
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
                            <td>${stockItem.stockDate}</td>  <!-- 날짜 추가 -->
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
