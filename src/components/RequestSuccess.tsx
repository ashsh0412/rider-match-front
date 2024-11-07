import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  useColorModeValue,
  Icon,
  Card,
  CardBody,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MapPin, Clock, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { createLocationData } from "../api/PostLocation";
import { formatDateTime } from "./RequestForm";
import { optLocations } from "../api/OptLocation";
import { reverseGeocode } from "../api/Geocoding";

interface Passenger {
  id: number;
  name: string;
  pickup: string;
  destination: string;
  time: string;
}

interface PassengerCardProps {
  passenger: Passenger;
  isSelected: boolean;
  onClick: (id: number) => void;
}

const PassengerCard = ({
  passenger,
  isSelected,
  onClick,
}: PassengerCardProps) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const successColor = useColorModeValue("green.500", "green.300");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const selectedCardBg = useColorModeValue("green.50", "green.900");

  return (
    <Card
      bg={isSelected ? selectedCardBg : cardBg}
      width="100%"
      cursor="pointer"
      onClick={() => onClick(passenger.id)}
      borderWidth={isSelected ? "2px" : "1px"}
      borderColor={isSelected ? "green.500" : "transparent"}
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
    >
      <CardBody>
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <HStack>
              <Icon as={User} w={5} h={5} color={successColor} />
              <Text fontWeight="bold" color={textColor}>
                {passenger.name}
              </Text>
            </HStack>
          </HStack>

          <Divider />

          <HStack spacing={3}>
            <Icon as={MapPin} w={4} h={4} color={subTextColor} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color={subTextColor}>
                Pickup
              </Text>
              <Text fontSize="sm" color={textColor}>
                {passenger.pickup}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={3}>
            <Icon as={MapPin} w={4} h={4} color={subTextColor} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color={subTextColor}>
                Destination
              </Text>
              <Text fontSize="sm" color={textColor}>
                {passenger.destination}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={3}>
            <Icon as={Clock} w={4} h={4} color={subTextColor} />
            <Text fontSize="sm" color={textColor}>
              {passenger.time}
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const SuccessMessage = () => {
  const [selectedPassenger, setSelectedPassenger] = useState<number | null>(
    null
  );
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const successColor = useColorModeValue("green.500", "green.300");

  const location = useLocation();
  const isRiderPage = location.pathname === "/rider-page";

  const mainMessage = isRiderPage
    ? "Ride Request Successful!"
    : "New Ride Requests Available!";
  const description = isRiderPage
    ? "Your ride request has been submitted successfully. We will notify you when a driver accepts your request."
    : "Select passengers to accept their ride request.";
  const subDescription = isRiderPage
    ? "You can check the status of your ride in the notifications."
    : null;

  const initializePassengers = async () => {
    setIsLoading(true);
    try {
      const formattedDate = formatDateTime(null);
      const userInfo = await createLocationData(formattedDate);

      if (!userInfo) {
        console.error("Failed to get user info");
        return;
      }

      if (isRiderPage) {
        const pickUpAddress = await reverseGeocode(
          userInfo.start_latitude,
          userInfo.start_longitude
        );
        const destination = await reverseGeocode(
          userInfo.end_latitude,
          userInfo.end_longitude
        );
        setPassengers([
          {
            id: 1,
            name: `${userInfo.first_name} ${userInfo.last_name}`,
            pickup: pickUpAddress,
            destination: destination,
            time: userInfo.date_time,
          },
        ]);
      } else {
        console.log("success");
        const optInfo = await optLocations();

        if (optInfo && Array.isArray(optInfo)) {
          const maxPassengers = 5;
          const newPassengers = []; // 임시 배열 생성

          for (let i = 0; i < Math.min(optInfo.length, maxPassengers); i++) {
            const passenger = optInfo[i];
            newPassengers.push({
              id: i,
              name: `${passenger.first_name} ${passenger.last_name}`,
              pickup: passenger.pickup_location,
              destination: passenger.dropoff_location,
              time: passenger.date_time,
            });
          }

          setPassengers(newPassengers); // 모든 승객 정보를 한 번에 설정
          console.log("Updated passengers:", newPassengers);
        }
      }
    } catch (error) {
      console.error("Error initializing passengers:", error);
      setPassengers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializePassengers();
  }, []);

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={6} align="center">
          <Spinner thickness="4px" speed="0.65s" size="xl" />
          <Text fontSize="lg" color={textColor} fontWeight="medium">
            Loading address information...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" w="100%">
      <VStack spacing={4} align="center">
        <Icon as={FaCheckCircle} w={12} h={12} color={successColor} />
        <Box fontSize="xl" fontWeight="bold" color={successColor}>
          {mainMessage}
        </Box>
        <Box color={textColor} textAlign="center">
          {description}
        </Box>
        <Box fontSize="sm" color={textColor} textAlign="center" mb={4}>
          {subDescription}
        </Box>

        {!isRiderPage && (
          <VStack spacing={4} w="100%">
            {passengers.map((passenger) => (
              <PassengerCard
                key={passenger.id}
                passenger={passenger}
                isSelected={selectedPassenger === passenger.id}
                onClick={setSelectedPassenger}
              />
            ))}
          </VStack>
        )}

        {isRiderPage && passengers.length > 0 && (
          <VStack spacing={4} w="100%">
            <PassengerCard
              passenger={passengers[0]}
              isSelected={false}
              onClick={() => {}}
            />
          </VStack>
        )}

        <Button
          w="full"
          mt={4}
          isDisabled={!isRiderPage && !selectedPassenger}
          onClick={() => {
            localStorage.removeItem("endCoordinates");
            localStorage.removeItem("startCoordinates");
          }}
        >
          {isRiderPage ? "Done" : "Accept"}
        </Button>
      </VStack>
    </Box>
  );
};

export default SuccessMessage;
