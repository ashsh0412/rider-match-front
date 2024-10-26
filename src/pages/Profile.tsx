import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Text,
  Input,
  VStack,
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Flex,
  useToast,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NavBar from "../components/NavBar";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  is_rider: boolean;
  username: string;
}

export default function Profile() {
  const toast = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // useColorModeValue 호출하여 색상 변수로 저장
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputTextColor = useColorModeValue("black", "white");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      });

      if (!response.ok) {
        navigate("/log-in");
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUserData(data);
      setFormData(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching profile",
        description: "Unable to fetch user profile. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      navigate("/log-in");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      console.log(updatedData);
      setIsEditing(false);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Unable to update profile. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  if (!userData) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <NavBar />
      <Container maxW="container.md" py={8} pt="80px">
        <Text fontSize="2xl" fontWeight="bold" mb={8}>
          Account Information
        </Text>

        <VStack spacing={8} align="center">
          <Avatar size="2xl" color="gray.800"></Avatar>

          {isEditing ? (
            <Card>
              <CardBody>
                <VStack spacing={4} w="full" maxW="xl">
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleInputChange}
                      border="1px solid"
                      borderColor={inputBorderColor}
                      bg={inputBgColor}
                      color={inputTextColor}
                      _focus={{
                        boxShadow: "0 0 0 1px",
                        borderColor: "blue.400",
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="last_name"
                      value={formData.last_name || ""}
                      onChange={handleInputChange}
                      border="1px solid"
                      borderColor={inputBorderColor}
                      bg={inputBgColor}
                      color={inputTextColor}
                      _focus={{
                        boxShadow: "0 0 0 1px",
                        borderColor: "blue.400",
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      border="1px solid"
                      borderColor={inputBorderColor}
                      bg={inputBgColor}
                      color={inputTextColor}
                      _focus={{
                        boxShadow: "0 0 0 1px",
                        borderColor: "blue.400",
                      }}
                    />
                  </FormControl>

                  <Flex justify="flex-end" gap={4} w="full" mt={4}>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      _hover={{ bg: "whiteAlpha.100" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      bg="blue.400"
                      color="white"
                      _hover={{ bg: "blue.500" }}
                    >
                      Save Changes
                    </Button>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <VStack spacing={6} align="center">
              <Text fontSize="2xl" fontWeight="semibold">
                {userData.first_name} {userData.last_name}
              </Text>
              <Card>
                <CardBody>
                  <Box p={6} borderRadius="xl" w="full">
                    <Flex justify="space-between" mb={4} w="2xl">
                      <Box>
                        <Text color="gray.400" fontSize="sm">
                          Username
                        </Text>
                        <Text>{userData.username}</Text>
                      </Box>
                    </Flex>
                    <Box mb={4}>
                      <Text color="gray.400" fontSize="sm">
                        Account Type
                      </Text>
                      <Text>
                        {userData.is_rider ? "Rider" : "Regular User"}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="gray.400" fontSize="sm">
                        Joined
                      </Text>
                      <Text>
                        {new Date(userData.date_joined).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Box>
                </CardBody>
              </Card>

              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                _hover={{ bg: "whiteAlpha.100" }}
              >
                Edit Profile
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
