document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('allStockTable');
    
    // 삭제 버튼 클릭 시 데이터 Firebase에서 제거
    table.addEventListener('click', function(event) {
        const button = event.target;
        
        // 'delete-btn' 클래스를 가진 버튼만 처리
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
