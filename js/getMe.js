const toggleButtonsVisibility = (shouldShow) => {
  const displayValue = shouldShow ? "block" : "none";
  const loginButtons = document.getElementsByClassName("login-btn");
  const signupButtons = document.getElementsByClassName("signup-btn");

  for (let i = 0; i < loginButtons.length; i++) {
    loginButtons[i].style.display = displayValue; // 로그인 버튼의 표시 여부 설정
  }
  for (let i = 0; i < signupButtons.length; i++) {
    signupButtons[i].style.display = displayValue; // 회원가입 버튼의 표시 여부 설정
  }
};

const displayName = (first_name, last_name) => {
  const userInfoDiv = document.querySelector(".user-info");
  const initials = `${first_name.charAt(0)}${last_name.charAt(
    0
  )}`.toUpperCase();
  const fullName = `${first_name} ${last_name}`;
  userInfoDiv.textContent = fullName.length > 12 ? initials : fullName;
  userInfoDiv.style.display = "block";
};

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

    // 로그인 상태일 경우 버튼 숨기기 및 사용자 이름 표시
    toggleButtonsVisibility(false);
    displayName(data.first_name, data.last_name); // 사용자 이름 표시
  } catch (error) {
    console.error("Fetch 요청 중 문제가 발생했습니다:", error);

    // 로그인 상태가 아닐 경우 버튼 보이기
    toggleButtonsVisibility(true);

    const userInfoDiv = document.querySelector(".user-info");
    userInfoDiv.style.display = "none"; // 사용자 이름 숨기기
  }
};

// 페이지가 로드될 때 로그인 상태 확인
checkLoginStatus();
