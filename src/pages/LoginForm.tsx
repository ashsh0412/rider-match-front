import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
  HStack,
  Icon,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGoogle, FaComment } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BASE_URL, KAKAO_REDIRECT_URL } from "../type";

export default function LoginCard() {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=527380010985-t4bcqpmkc7npagt417spra1fl3tpkh5s.apps.googleusercontent.com&redirect_uri=http://127.0.0.1:3000/oauth/google&response_type=code&scope=openid%20profile%20email`;
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=7cfbc93e53b15cc24fff53e43bf0dc37&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;

  useEffect(() => {
    fetch(`${BASE_URL}users/log-in`);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    const { username, password } = formData;
    if (!username || !password) {
      toast({
        title: "All fields must be filled.",
        status: "warning",
        position: "bottom-right",
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}users/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Logged In!",
          status: "success",
          position: "bottom-right",
          isClosable: true,
        });
        navigate("/rider-page");
      } else {
        const data = await response.json();
        toast({
          title: data.error || "An error occurred.",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred while logging in.",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        bg={useColorModeValue("white", "gray.700")}
        p={8}
        borderRadius="md"
        w="100%"
        maxW="400px"
        boxShadow="md"
      >
        <VStack spacing={6} align="stretch">
          <Heading fontSize={"3xl"} textAlign={"center"}>
            Log in
          </Heading>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              borderColor="gray.300"
              _hover={{ borderColor: "gray.400" }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  color="gray.500"
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            onClick={handleSubmit}
          >
            Log in
          </Button>
          <Text color="gray.500" textAlign="center">
            Or continue with
          </Text>
          <HStack spacing={4}>
            <Button
              as="a"
              href={googleAuthUrl}
              w="full"
              variant="outline"
              borderColor="gray.300"
              leftIcon={<Icon as={FaGoogle} />}
            >
              Google
            </Button>
            <Button
              as="a"
              href={kakaoAuthUrl}
              w="full"
              variant="outline"
              borderColor="gray.300"
              leftIcon={<Icon as={FaComment} />}
            >
              Kakao
            </Button>
          </HStack>
          <Text textAlign="center">
            Don't have an account?{" "}
            <Link color="blue.500" href="/signup">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
