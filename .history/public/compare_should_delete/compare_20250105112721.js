document.querySelectorAll('#allStockTable .editable').forEach(cell => {
    cell.addEventListener('click', function() {
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

            const productRef = ref(db, `stocks/${product}/${size}/${type}`);

            update(productRef, {
                [fieldName]: newValue
            }).then(() => {
                console.log(`Updated ${fieldName} to ${newValue}`);
            }).catch((error) => {
                console.error("Update failed:", error);
            });
        });
    });
});
