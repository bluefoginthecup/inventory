// 전체 재고 테이블에서 삭제 버튼 클릭 시 데이터 삭제
document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('allStockTable');

    // 삭제 버튼 클릭 시 데이터 Firebase에서 제거
    table.addEventListener('click', function(event) {
        const button = event.target;

        // 클릭한 버튼이 'delete-btn'인 경우
        if (button.classList.contains('delete-btn')) {
            const row = button.closest('tr');  // 삭제 버튼이 있는 행을 찾음
            const product = row.querySelector('[data-field="product"]').textContent;
            const size = row.querySelector('[data-field="size"]').textContent;
            const type = row.querySelector('[data-field="type"]').textContent;

            const db = getDatabase();
            const productRef = ref(db, `stocks/${product}/${size}/${type}`);  // 정확한 Firebase 경로

            // Firebase에서 데이터 삭제
            remove(productRef).then(() => {
                console.log(`Deleted data for ${product} ${size} ${type}`);
                row.remove();  // 테이블에서 해당 행을 삭제
            }).catch((error) => {
                console.error("Delete failed:", error);
            });
        }
    });
});
