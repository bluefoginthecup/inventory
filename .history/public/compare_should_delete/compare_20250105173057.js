// 1. 한글 초성 추출 함수
function extractInitials(str) {
    const KOREAN_START = 0xAC00; // 가
    const KOREAN_END = 0xD7A3;  // 힣
    const INITIALS = [
        "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
    ];

    let result = "";

    for (const char of str) {
        const code = char.charCodeAt(0);

        if (code >= KOREAN_START && code <= KOREAN_END) {
            // 한글 초성 추출
            const initialIndex = Math.floor((code - KOREAN_START) / 588);
            result += INITIALS[initialIndex];
        } else if (/[a-zA-Z0-9]/.test(char)) {
            // 영어/숫자 그대로 추가
            result += char.toLowerCase();
        }
    }
    return result;
}

// 2. 검색어와 데이터 비교 (초성 포함)
function matchesSearchTerm(searchTerm, dataTerm) {
    const searchInitials = extractInitials(searchTerm);
    const dataInitials = extractInitials(dataTerm);

    return dataInitials.includes(searchInitials);
}

// 3. 검색 함수 수정
function searchProducts(searchTerm) {
    const productsRef = ref(db, 'stocks');

    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            alert('Firebase에 데이터가 없습니다.');
            updateSearchTable([]); // 검색 결과 없을 때 테이블 초기화
            return;
        }

        const results = [];
        for (const date in data) {
            const dailyData = data[date];
            for (const product in dailyData) {
                // 초성 검색으로 변경
                if (matchesSearchTerm(searchTerm, product)) { 
                    const productData = dailyData[product];
                    results.push({ date, product, details: productData });
                }
            }
        }

        if (results.length === 0) {
            alert('검색 결과가 없습니다.');
        }

        updateSearchTable(results);
    });
}
