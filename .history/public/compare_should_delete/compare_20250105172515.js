// 제품 검색 버튼 클릭 이벤트
document.getElementById('searchBtn').addEventListener('click', function () {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    if (!searchTerm) {
        alert('제품명을 입력해주세요.');
        return;
    }

    searchProducts(searchTerm); // 제품명을 기준으로 검색 실행
});

// 제품 검색 함수
function searchProducts(searchTerm) {
    const productsRef = ref(db, 'stocks');

    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            alert('Firebase에 데이터가 없습니다.');
            updateSearchTable([]); // 검색 결과 없을 때 테이블 초기화
            return;
        }

        const results = [];
        for (const date in data) {
            const dailyData = data[date];
            for (const product in dailyData) {
                if (product.toLowerCase().includes(searchTerm)) {
                    const productData = dailyData[product];
                    results.push({ date, product, details: productData });
                }
            }
        }

        if (results.length === 0) {
            alert('검색 결과가 없습니다.');
        }

        updateSearchTable(results);
    });
}

// 검색 결과 테이블 업데이트 함수
function updateSearchTable(results) {
    const tableBody = document.getElementById('searchResults').querySelector('tbody');
    tableBody.innerHTML = ''; // 기존 데이터 초기화

    if (results.length === 0) {
        const noResultsRow = tableBody.insertRow();
        const cell = noResultsRow.insertCell(0);
        cell.colSpan = 8; // 테이블의 열 개수
        cell.textContent = "검색 결과가 없습니다.";
        return;
    }

    results.forEach((result) => {
        const { date, product, details } = result;

        for (const size in details) {
            for (const type in details[size]) {
                const stockItem = details[size][type];
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${date}</td>
                    <td>${convertToKorean(product)}</td>
                    <td>${convertToKorean(size)}</td>
                    <td>${convertToKorean(type)}</td>
                    <td>${stockItem.stockAmount || 0}</td>
                    <td>${stockItem.incomingAmount || 0}</td>
                    <td>${stockItem.outgoingAmount || 0}</td>
                    <td>${stockItem.neededAmount || 0}</td>
                `;
            }
        }
    });
}
