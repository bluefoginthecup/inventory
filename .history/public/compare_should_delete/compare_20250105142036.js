// Firebase에서 전체 재고 정보 불러오기
function loadAllStock() {
    const productsRef = ref(db, 'stocks'); // Firebase에서 재고 정보 가져오기
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
