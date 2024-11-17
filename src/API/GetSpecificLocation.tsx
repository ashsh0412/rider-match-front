import Cookies from "js-cookie";

// API 응답을 위한 인터페이스
interface LocationResponse {
  user: number;
}

// 위치 데이터를 위한 인터페이스
export interface LocationData {
  user: number;
}

export const getLocationsById = async (id: number): Promise<number> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/locations/get/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패. 상태 코드: ${response.status}`);
    }

    const data: LocationResponse = await response.json();
    return data.user;
  } catch (error) {
    console.error("위치 데이터 조회 중 오류 발생:", error);
    throw error;
  }
};