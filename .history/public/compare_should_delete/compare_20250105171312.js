document.getElementById('submitButton').addEventListener('click', function () {
    const stockDate = document.getElementById('stockDate').value; // 날짜 가져오기
    const product = document.getElementById('product').value; 
    const size = document.getElementById('size').value;       
    const type = document.getElementById('type').value;     
    const stockAmountValue = document.getElementById('stockAmount')?.value || '';  
    const neededAmountValue = document.getElementById('neededAmount')?.value || '';  

    // 숫자 변환 및 기본값 설정
    const stockAmount = parseInt(stockAmountValue);
    const neededAmount = parseInt(neededAmountValue);

    // 유효성 검사
    if (!stockDate) {
        alert('날짜를 입력해주세요.');
        return;
    }

    if (!product || !size || !type || isNaN(stockAmount) || isNaN(neededAmount)) {
        alert('모든 필드를 올바르게 입력해주세요.');
        return;
    }

    // 데이터 저장 호출
    saveStockData(stockDate, product, size, type, stockAmount, neededAmount);
});
