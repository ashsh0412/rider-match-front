import React from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { FaUserFriends, FaInfoCircle, FaCar } from "react-icons/fa";

const DriverInfo: React.FC = () => {
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  const safetyGuidelines = [
    "Ensure all passengers are wearing seatbelts",
    "Maintain posted speed limits",
    "Check surroundings during passenger pickup/drop-off",
    "Maintain clear communication with passengers",
  ];

  return (
    <Box>
      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        position="relative"
        overflow="hidden"
        sx={{
          zIndex: 0,
        }}
      >
        <HStack spacing={2} mb={4}>
          <Icon as={FaInfoCircle} fontSize="xl" color={iconColor} />
          <Text fontWeight="bold" fontSize="lg">
            Driver Information
          </Text>
        </HStack>

        <VStack align="start" spacing={4}>
          <HStack spacing={3}>
            <Icon as={FaUserFriends} color={iconColor} boxSize={5} />
            <Box>
              <Text fontWeight="semibold">Maximum Passengers: 5</Text>
              <Text fontSize="sm" color="gray.500">
                During the beta phase, we're limiting to 5 passengers per ride
                due to API limitations.
              </Text>
            </Box>
          </HStack>

          <HStack spacing={3} align="start">
            <Icon as={FaCar} color={iconColor} boxSize={5} />
            <Box>
              <Text fontWeight="semibold">Safety Guidelines</Text>
              <Stack spacing={1} mt={1}>
                {safetyGuidelines.map((guideline, index) => (
                  <Text key={index} fontSize="sm" color="gray.500">
                    • {guideline}
                  </Text>
                ))}
              </Stack>
            </Box>
          </HStack>
        </VStack>

        <Box
          position="absolute"
          right="-20px"
          bottom="-20px"
          opacity={0.05}
          transform="rotate(-15deg)"
        >
          <Icon as={FaCar} boxSize={32} />
        </Box>
      </Box>
    </Box>
  );
};

export default DriverInfo;
