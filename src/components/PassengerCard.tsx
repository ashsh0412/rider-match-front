import {
  Card,
  CardBody,
  VStack,
  HStack,
  Icon,
  Text,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { Clock, MapPin, User } from "lucide-react";

export interface Passenger {
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

export const PassengerCard = ({
  passenger,
  isSelected,
  onClick,
}: PassengerCardProps) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const successColor = useColorModeValue("green.500", "green.300");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const selectedCardBg = useColorModeValue("green.50", "green.900");

  const isNoPassenger = passenger.name === "매칭 가능한 승객이 없습니다";

  return (
    <Card
      bg={isSelected ? selectedCardBg : cardBg}
      width="100%"
      cursor={isNoPassenger ? "default" : "pointer"}
      onClick={() => !isNoPassenger && onClick(passenger.id)}
      borderWidth={isSelected ? "2px" : "1px"}
      borderColor={isSelected ? "green.500" : "transparent"}
      transition="all 0.2s"
      _hover={
        isNoPassenger ? {} : { transform: "translateY(-2px)", shadow: "md" }
      }
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
