// 테이블 셀 클릭 시 수정 가능하게 만들기
document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('allStockTable');
    
    table.addEventListener('click', function(event) {
        const cell = event.target;
        
        // 'editable' 클래스를 가진 셀만 처리
        if (cell.classList.contains('editable')) {
            const currentValue = cell.textContent;
            const fieldName = cell.dataset.field;  // "product", "size", "type", "stockAmount", "neededAmount"

            // 입력 필드로 바꾸기
            const inputField = document.createElement('input');
            inputField.value = currentValue;
            cell.textContent = '';
            cell.appendChild(inputField);

            inputField.addEventListener('blur', function() {
                const newValue = inputField.value;
                cell.textContent = newValue;

                // Firebase에서 해당 데이터 업데이트 (기존 데이터 덮어쓰기)
                const row = cell.closest('tr');
                const product = row.querySelector('[data-field="product"]').textContent;
                const size = row.querySelector('[data-field="size"]').textContent;
                const type = row.querySelector('[data-field="type"]').textContent;
                const db = getDatabase();
                const productRef = ref(db, `stocks/${product}/${size}/${type}`);

                // 기존 데이터를 가져와서 덮어쓰기
                const currentData = {
                    stockAmount: row.querySelector('[data-field="stockAmount"]').textContent,
                    neededAmount: row.querySelector('[data-field="neededAmount"]').textContent
                };

                // 기존 데이터를 덮어쓰는 방식으로 set() 사용
                set(productRef, {
                    ...currentData,  // 기존 데이터 유지
                    [fieldName]: newValue  // 수정된 필드만 업데이트
                }).then(() => {
                    console.log(`Updated ${fieldName} to ${newValue}`);
                }).catch((error) => {
                    console.error("Update failed:", error);
                });
            });
        }
    });
});
