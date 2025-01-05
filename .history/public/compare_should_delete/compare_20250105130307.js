import { getDatabase, ref, update, remove } from 'firebase/database';

document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('allStockTable');
    
    // 테이블 셀 클릭 시 수정 가능하게 만들기
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

                // Firebase에서 해당 데이터 업데이트
                const row = cell.closest('tr');
                const product = row.querySelector('[data-field="product"]').textContent;
                const size = row.querySelector('[data-field="size"]').textContent;
                const type = row.querySelector('[data-field="type"]').textContent;

                const db = getDatabase();  // Firebase 데이터베이스 인스턴스
                const productRef = ref(db, `stocks/${product}/${size}/${type}`);

                // Firebase에서 특정 필드만 수정
                update(productRef, {
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

            const db = getDatabase();
            const productRef = ref(db, `stocks/${product}/${size}/${type}`);
            
            // Firebase에서 데이터 삭제
            remove(productRef).then(() => {
                console.log(`Deleted data for ${product} ${size} ${type}`);
            }).catch((error) => {
                console.error("Delete failed:", error);
            });
        }
    });
});
