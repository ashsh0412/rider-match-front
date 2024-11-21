// logOut.tsx
import Cookies from "js-cookie";
import { BASE_URL } from "../type";
import { NavigateFunction } from "react-router-dom"; // useNavigate의 타입

// 로그아웃 함수
const logOut = async (navigate: NavigateFunction): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}users/log-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include", // 쿠키를 포함하여 요청
    });

    if (!response.ok) {
      throw new Error("로그아웃 실패");
    }

    // 성공 시 홈으로 이동
    navigate("/");
  } catch (error) {
    console.error("로그아웃 오류:", error);
  }
};

export default logOut;
