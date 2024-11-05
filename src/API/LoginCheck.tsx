// LoginCheck.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { getCurrentUser } from "./GetUserInfo";

interface LoginCheckProps {
  children: React.ReactNode;
}

const LoginCheck = ({ children }: LoginCheckProps) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await getCurrentUser();

        // 사용자 타입에 따라 적절한 페이지로 리다이렉트
        if (userData.is_rider) {
          navigate("/driver-page");
        } else if (!userData.is_rider) {
          navigate("/rider-page");
        } else {
          // 타입이 지정되지 않은 경우의 처리
          console.warn("User type not specified");
          navigate("/profile"); // 또는 다른 기본 페이지
        }

        setIsChecking(false);
      } catch (error) {
        console.error("로그인 확인 중 오류 발생:", error);
        navigate("/log-in");
        setIsChecking(false);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  // 로그인 체크 중에는 로딩 스피너 표시
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
