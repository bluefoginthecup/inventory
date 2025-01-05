// 전체 재고 테이블 업데이트
function updateAllStockTable(products) {
    const tableBody = document.getElementById('allStockTable').querySelector('tbody');
    tableBody.innerHTML = ''; // 기존 내용 삭제

    if (products.length === 0) {
        const noResultsRow = tableBody.insertRow();
        const cell = noResultsRow.insertCell(0);
        cell.colSpan = 7;
        cell.textContent = "전체 재고가 없습니다.";
        return;
    }

    // 전체 재고 목록을 테이블에 추가
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
    })
};

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

        // 전체 재고 테이블 업데이트
        updateAllStockTable(allProducts);
    });
}

// 페이지가 로드될 때 전체 재고를 불러옴
window.onload = function() {
    loadAllStock();  // Firebase에서 전체 재고를 불러와서 테이블 갱신
};
