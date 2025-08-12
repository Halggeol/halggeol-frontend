import api from '@/utils/axios'; // 설정해둔 중앙 axios 인스턴스를 import 합니다.

/**
 * 사용자의 최근 검색어 목록을 조회합니다. (로그인 필요)
 * axios 인터셉터가 자동으로 토큰을 추가해주므로 여기서는 토큰 처리가 필요 없습니다.
 * @param {number} size - 가져올 검색어 개수
 * @returns {Promise<Array>} 최근 검색어 목록 또는 실패 시 빈 배열
 */
export const getRecentSearches = async (size = 5) => {
  try {
    // GET 요청 시 파라미터는 { params: { ... } } 객체로 전달합니다.
    const response = await api.get('/search-logs/recent', {
      params: { size },
    });
    return response.data;
  } catch (error) {
    console.error('최근 검색어 조회 API 호출 실패:', error);
    return []; // 실패 시 항상 빈 배열을 반환하여 UI 에러를 방지합니다.
  }
};

/**
 * 인기 검색어 목록을 조회합니다.
 * @param {number} size - 가져올 검색어 개수
 * @returns {Promise<Array>} 인기 검색어 목록 또는 실패 시 빈 배열
 */
export const getPopularSearches = async (size = 5) => {
  try {
    const response = await api.get('/search-logs/popular', {
      params: { size },
    });
    return response.data;
  } catch (error) {
    console.error('인기 검색어 조회 API 호출 실패:', error);
    return []; // 실패 시 항상 빈 배열을 반환합니다.
  }
};

// 최근 검색어 개별 삭제 (로그인 필요)
export const deleteRecentSearch = async keyword => {
  try {
    // keyword가 URL 경로에 포함되므로, 인코딩하여 안전하게 전달
    await api.delete(`/search-logs/recent/${encodeURIComponent(keyword)}`);
    return true;
  } catch (error) {
    console.error('최근 검색어 개별 삭제 API 호출 실패: ', error);
    return false;
  }
};

// 최근 검색어 전체 삭제 (로그인 필요)
export const deleteAllRecentSearches = async () => {
  try {
    await api.delete('/search-logs/recent/all');
    return true;
  } catch (error) {
    console.error('최근 검색어 전체 삭제 API 실패', error);
    return false;
  }
};
