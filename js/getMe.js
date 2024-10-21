const checkLoginStatus = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include", // 쿠키를 포함하는 설정
    });

    if (!response.ok) {
      throw new Error("로그인 상태 확인 중 문제가 발생했습니다.");
    }

    const data = await response.json();
    console.log("사용자 정보:", data);
  } catch (error) {
    console.error("Fetch 요청 중 문제가 발생했습니다:", error);
  }
};

checkLoginStatus();
