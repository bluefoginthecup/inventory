document.addEventListener('DOMContentLoaded', function() {
    const searchTab = document.getElementById('searchTab');
    const movementTab = document.getElementById('movementTab'); // 올바른 ID
    const allStockTab = document.getElementById('allStockTab');

    if (searchTab) {
        searchTab.addEventListener('click', function() {
            activateTab('searchSection');
        });
    } else {
        console.error('searchTab 요소를 찾을 수 없습니다.');
    }

    if (movementTab) { // inputTab -> movementTab
        movementTab.addEventListener('click', function() {
            activateTab('movementSection');
        });
    } else {
        console.error('movementTab 요소를 찾을 수 없습니다.');
    }

    if (allStockTab) {
        allStockTab.addEventListener('click', function() {
            activateTab('allStockSection');
        });
    } else {
        console.error('allStockTab 요소를 찾을 수 없습니다.');
    }
});
