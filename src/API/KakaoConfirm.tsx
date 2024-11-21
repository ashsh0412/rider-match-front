import { Box, Spinner, useToast, VStack } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../type";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const kakaoLogin = async (code: string) => {
  try {
    const response = await instance.post(
      "users/kakao",
      { code },
      {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken") || "",
          "Content-Type": "application/json",
        },
      }
    );
    return response.status;
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data === "") {
      // 로그인은 성공했지만 빈 응답이 온 경우
      return 200;
    }
    throw error;
  }
};

export default function KakaoConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const navigate = useNavigate();
  const confirmLogin = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    if (code) {
      const status = await kakaoLogin(code);
      if (status === 200) {
        toast({
          status: "success",
          title: "Welcome!",
          position: "bottom-right",
          description: "Successfully Loged In!",
        });
        navigate("/rider-page");
      }
    }
  };
  useEffect(() => {
    confirmLogin();
  }, []);
  return (
    <Box bg="black" minH="100vh" color="white">
      <VStack justifyContent="center" spacing={8} minH="100vh" px={4}>
        <Spinner size="xl" />
      </VStack>
    </Box>
  );
}
