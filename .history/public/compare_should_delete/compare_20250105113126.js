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

    products.forEach(product => {
        const productName = Object.keys(product)[0];
        const productNameKorean = convertToKorean(productName);

        for (const size in product[productName]) {
            for (const type in product[productName][size]) {
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
    });
}
