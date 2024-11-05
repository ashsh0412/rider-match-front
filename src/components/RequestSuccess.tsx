import { useState } from "react";
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
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MapPin, Clock, User } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Passenger {
  id: number;
  name: string;
  pickup: string;
  destination: string;
  time: string;
  passengers: string;
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

  // Simulated passengers data
  const passengers: Passenger[] = [
    {
      id: 1,
      name: "James Wilson",
      pickup: "SGD Security",
      destination: "Main Terminal",
      time: "2:18",
      passengers: "2",
    },
    {
      id: 2,
      name: "Sarah Parker",
      pickup: "Central Station",
      destination: "Airport Terminal 2",
      time: "2:25",
      passengers: "3",
    },
    {
      id: 3,
      name: "Michael Brown",
      pickup: "Hotel Grand",
      destination: "Convention Center",
      time: "2:30",
      passengers: "1",
    },
  ];

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

        {/* Passenger Selection Cards - 세로 정렬 */}
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

        {/* Rider View */}
        {isRiderPage && (
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
          colorScheme="black"
          bg="black"
          _hover={{ bg: "gray.800" }}
          isDisabled={!isRiderPage && !selectedPassenger}
        >
          {!isRiderPage ? "Accept Selected Ride" : "Track Your Ride"}
        </Button>
      </VStack>
    </Box>
  );
};

export default SuccessMessage;
