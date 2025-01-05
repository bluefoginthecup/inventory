document.getElementById('submitButton').addEventListener('click', function () {
    const stockDate = document.getElementById('stockDate')?.value || ''; 
    const product = document.getElementById('product')?.value || '';
    const size = document.getElementById('size')?.value || '';
    const type = document.getElementById('type')?.value || '';
    const stockAmountValue = document.getElementById('stockAmount')?.value || '';
    const neededAmountValue = document.getElementById('neededAmount')?.value || '';
    const incomingAmountValue = document.getElementById('incomingAmount')?.value || ''; // 입고 수량
    const outgoingAmountValue = document.getElementById('outgoingAmount')?.value || ''; // 출고 수량
    const stockAmount = parseInt(stockAmountValue);
    const neededAmount = parseInt(neededAmountValue);
    const incomingAmount = parseInt(incomingAmountValue);
    const outgoingAmount = parseInt(outgoingAmountValue);

    console.log("Input values:", { stockDate, product, size, type, stockAmount, neededAmount, incomingAmount, outgoingAmount });

    // 유효성 검사
    if (!stockDate || !product || !size || !type || isNaN(stockAmount) || isNaN(neededAmount) || isNaN(incomingAmount) || isNaN(outgoingAmount)) {
        alert('모든 필드를 올바르게 입력해주세요.');
        return; // 이 코드는 함수 내부에 있으므로 문제가 없습니다.
    }

    // 데이터 저장 호출
    saveStockData(stockDate, product, size, type, stockAmount, neededAmount, incomingAmount, outgoingAmount);
});

function saveStockData(stockDate, product, size, type, stockAmount, neededAmount, incomingAmount, outgoingAmount) {
    if (
        !stockDate ||
        !product ||
        !size ||
        !type ||
        stockAmount === undefined ||
        neededAmount === undefined ||
        incomingAmount === undefined ||
        outgoingAmount === undefined
    ) {
        console.error('저장할 데이터에 undefined 값이 포함되어 있습니다.');
        alert('저장할 수 없습니다. 입력값을 확인해주세요.');
        return; // 이 `return`도 함수 내부에 있으므로 문제가 없습니다.
    }

    // Firebase 경로: stocks/{날짜}/{제품명}/{사이즈}/{재고 종류}
    const productRef = ref(db, `stocks/${stockDate}/${product}/${size}/${type}`);

    set(productRef, {
        stockAmount: stockAmount,
        neededAmount: neededAmount,
        incomingAmount: incomingAmount,
        outgoingAmount: outgoingAmount,
    })
        .then(() => {
            alert('재고 정보가 저장되었습니다.');
            document.getElementById('stockForm').reset(); // 폼 초기화
        })
        .catch((error) => {
            console.error('데이터 저장 실패:', error);
            alert('재고 정보를 저장하는데 실패했습니다.');
        });
}
