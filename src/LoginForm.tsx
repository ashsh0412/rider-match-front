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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGoogle, FaComment } from "react-icons/fa";
import Cookies from "js-cookie";

export default function LoginCard() {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    username: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/users/log-in");
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
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/users/log-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken") || "",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        // 로그인 성공
        toast({
          title: "Logged In!",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        window.location.href = "http://127.0.0.1:5500/index.html";
      } else {
        // 로그인 실패
        const data = await response.json(); // 에러 메시지 가져오기
        toast({
          title: data.error || "An error occurred.",
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred while logging in.",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    // return 위치를 수정
    <Flex minH="100vh" align="center" justify="center" bg="white">
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        w="100%"
        maxW="400px"
        boxShadow="md"
      >
        <VStack spacing={6} align="stretch">
          <Heading color="black" fontSize="3xl" textAlign="center">
            Log in
          </Heading>
          <FormControl id="username">
            <FormLabel color="gray.700">Username</FormLabel>
            <Input
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              borderColor="gray.300"
              _hover={{ borderColor: "gray.400" }}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel color="gray.700">Password</FormLabel>
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
              w="full"
              variant="outline"
              borderColor="gray.300"
              color="black"
              _hover={{ bg: "gray.50" }}
              leftIcon={<Icon as={FaGoogle} />}
            >
              Google
            </Button>
            <Button
              w="full"
              variant="outline"
              borderColor="gray.300"
              color="black"
              _hover={{ bg: "gray.50" }}
              leftIcon={<Icon as={FaComment} />}
            >
              Kakao
            </Button>
          </HStack>
          <Text color="gray.600" textAlign="center">
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
