import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGoogle, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SignupCard() {
  const toast = useToast(); // useToast 훅을 초기화
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/users/");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, password, username } = formData;

    if (!firstName || !lastName || !password || !username) {
      toast({
        title: "All required fields must be filled.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    // Username length check
    if (username.length < 4) {
      toast({
        title: "Username must be at least 4 characters long.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    // Password length check
    if (password.length < 8) {
      toast({
        title: "Password must be at least 8 characters long.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    // Email format check (basic regex check)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      toast({
        title: "Invalid email format.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          username: username,
        }),
      });

      if (response.ok) {
        toast({
          title: "User created successfully!",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        navigate("/log-in");
      } else {
        toast({
          title: "A user with that username already exists.",
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred while creating user.",
        status: "error",
        position: "top-right",
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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={formData.username}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              loadingText="Submitting"
              size="lg"
              bg={"black"}
              color={"white"}
              _hover={{
                bg: "gray.500",
              }}
              onClick={handleSubmit} // Submit form on click
            >
              Sign up
            </Button>
            <Stack>
              <HStack spacing={4}>
                <Button
                  w="full"
                  variant="outline"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.50" }}
                  leftIcon={<Icon as={FaGoogle} />}
                >
                  Google
                </Button>
                <Button
                  w="full"
                  variant="outline"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.50" }}
                  leftIcon={<Icon as={FaComment} />}
                >
                  Kakao
                </Button>
              </HStack>
              <Text textAlign="center">
                Already a user?{" "}
                <Link color="blue.500" href="/log-in">
                  Log In
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
