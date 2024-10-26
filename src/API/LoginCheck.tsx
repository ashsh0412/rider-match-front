import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Center, Spinner } from "@chakra-ui/react";

interface LoginCheckProps {
  children: React.ReactNode;
}

const LoginCheck = ({ children }: LoginCheckProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken") || "",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("로그인이 필요합니다.");
        }

        // 로그인 확인 완료
        setIsChecking(false);
      } catch (error) {
        console.error("로그인 확인 중 오류 발생:", error);
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        navigate("/log-in");
      }
    };

    checkLoginStatus();
  }, [navigate]);

  // 로그인 체크 중에는 아무것도 보여주지 않음
  if (isChecking) {
    return (
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  // 로그인이 확인된 경우 children을 렌더링
  return <>{children}</>;
};

export default LoginCheck;
