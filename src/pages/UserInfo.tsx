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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  Divider,
  useDisclosure,
  IconButton,
  Tooltip,
  Switch,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NavBar from "../components/NavBar";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ProfileUpdate } from "../api/UpdateUser";
import { DeleteAccount } from "../api/DeleteUser";

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
  const [isRider, setIsRider] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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
      setIsRider(data.is_rider);
    } catch (error) {
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

  const handleSubmit = () => {
    ProfileUpdate({
      formData: { ...formData, is_rider: isRider },
      setUserData,
      setIsEditing,
      toast,
    });
  };

  const handleDelete = () => {
    DeleteAccount({
      navigate,
      toast,
    });
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
        <Flex justify="space-between" align="center" mb={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Profile Settings
          </Text>
          <Tooltip label="Delete Account" hasArrow>
            <IconButton
              aria-label="Delete account"
              icon={<FiTrash2 />}
              variant="ghost"
              colorScheme="red"
              onClick={onOpen}
            />
          </Tooltip>
        </Flex>

        <VStack spacing={8} align="stretch">
          <Card shadow="md" borderRadius="xl">
            <CardBody>
              <VStack spacing={6} align="center">
                <Avatar size="2xl" />
                <VStack spacing={2} align="center">
                  <Text fontSize="2xl" fontWeight="bold">
                    {userData.first_name} {userData.last_name}
                  </Text>
                  <Badge
                    colorScheme={userData.is_rider ? "green" : "blue"}
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {userData.is_rider ? "Driver" : "Rider"}
                  </Badge>
                </VStack>
              </VStack>

              <Divider my={6} />

              {isEditing ? (
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="last_name"
                      value={formData.last_name || ""}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Switch Status</FormLabel>
                    <Switch
                      id="isRider"
                      isChecked={isRider}
                      onChange={() => setIsRider((prev) => !prev)}
                    />
                  </FormControl>

                  <Flex justify="flex-end" gap={4} mt={4}>
                    <Button onClick={() => setIsEditing(false)} variant="ghost">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} colorScheme="blue">
                      Save Changes
                    </Button>
                  </Flex>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="sm">Username</Text>
                      <Text fontWeight="medium">{userData.username}</Text>
                    </Box>
                    <Tooltip label="Edit Profile" hasArrow>
                      <IconButton
                        aria-label="Edit profile"
                        icon={<FiEdit2 />}
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                      />
                    </Tooltip>
                  </Flex>

                  <Box>
                    <Text fontSize="sm">Email</Text>
                    <Text fontWeight="medium">{userData.email}</Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm">Joined</Text>
                    <Text fontWeight="medium">
                      {new Date(userData.date_joined).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Text>
                  </Box>
                </VStack>
              )}
            </CardBody>
          </Card>
        </VStack>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards. All your
                data will be permanently removed.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    handleDelete();
                    onClose();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Box>
  );
}
