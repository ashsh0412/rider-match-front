// logOut.js
import Cookies from "js-cookie";

const logOut = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/log-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include", // 쿠키를 요청에 포함
    });

    if (!response.ok) throw new Error("로그아웃 실패");

    window.location.href = "http://127.0.0.1:5500"; // 로그아웃 후 리다이렉션
  } catch (error) {
    console.error("로그아웃 오류:", error);
  }
};

export default logOut;