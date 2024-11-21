import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import MapComponent from "../maps/LoadingMap";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/GetUserInfo";
import { UserData } from "../type";
import logOut from "../API/Logout";

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <Box
    bg={useColorModeValue("white", "gray.700")}
    p={8}
    borderRadius="xl"
    boxShadow="lg"
    transition="all 0.3s"
    _hover={{
      transform: "translateY(-4px)",
      boxShadow: "xl",
    }}
  >
    <HStack spacing={3} mb={4}>
      <Box as="span" color="blue.500" fontSize="xl">
        •
      </Box>
      <Heading as="h3" size="md" color={useColorModeValue("gray.900", "white")}>
        {title}
      </Heading>
    </HStack>
    <Text color={useColorModeValue("gray.600", "gray.300")}>{description}</Text>
  </Box>
);

export const WelcomePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const bgGradient = useColorModeValue(
    "linear(to-r, gray.50, gray.100)",
    "linear(to-r, gray.800, gray.900)"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut(navigate);
      setUser(null);
      // logOut 함수 내에서 이미 navigate("/")를 호출하므로 여기서는 불필요
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const buttonStyle = {
    height: "40px",
    minWidth: "100px",
    fontSize: "md",
  };

  const features = [
    {
      title: "Eco-Friendly Journeys",
      description:
        "Reduce your carbon footprint by sharing rides. Let's go green together, one carpool at a time.",
    },
    {
      title: "24/7 Service",
      description:
        "Available anytime, anywhere. Your reliable transportation partner.",
    },
    {
      title: "Meet New Friends",
      description:
        "Carpool with like-minded people and make your commute more enjoyable with new conversations.",
    },
    {
      title: "Flexible Rides",
      description:
        "Change of plans? No worries! Our carpool network adapts to your schedule.",
    },
  ];

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Header */}
      <Box bg={useColorModeValue("white", "gray.800")} boxShadow="sm" py={6}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Box></Box>
            <HStack spacing={4}>
              {user ? (
                <>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={handleLogout}
                    {...buttonStyle}
                  >
                    Log out
                  </Button>
                  {user.username.length <= 10 ? (
                    <Button colorScheme="blue" {...buttonStyle}>
                      {user.username}
                    </Button>
                  ) : (
                    <Avatar
                      size="md"
                      name={user.username}
                      bg="blue.500"
                      color="white"
                    />
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => navigate("/log-in")}
                    {...buttonStyle}
                  >
                    Log in
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => navigate("/signup")}
                    {...buttonStyle}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={12}>
        <Flex direction={{ base: "column", lg: "row" }} gap={8} align="center">
          {/* Left Panel */}
          <VStack flex={1} align="stretch" spacing={8}>
            <Heading
              as="h1"
              size="2xl"
              color={useColorModeValue("gray.900", "white")}
              lineHeight="1.2"
            >
              Your Journey Begins Here
            </Heading>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </Grid>

            <Button
              onClick={() => navigate("/rider-page")}
              size="lg"
              colorScheme="blue"
              height="14"
              borderRadius="full"
              fontSize="lg"
            >
              Start Your Journey
            </Button>
          </VStack>

          {/* Right Panel (Map) */}
          <Box
            flex={1}
            height={{ base: "40vh", md: "60vh", lg: "80vh" }}
            maxH="800px"
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="xl"
          >
            <MapComponent />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default WelcomePage;
