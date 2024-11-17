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
import {
  FaUserFriends,
  FaInfoCircle,
  FaCar,
  FaRoute,
  FaClock,
} from "react-icons/fa";

const DriverInfo: React.FC = () => {
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const bgColor = useColorModeValue("gray.100", "gray.700");

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
        <VStack align="start" spacing={4}>
          <HStack
            spacing={3}
            align="start" // 상단 정렬로 변경
          >
            <Icon
              as={FaClock}
              color={iconColor}
              boxSize={5}
              mt={1} // 텍스트 첫 줄과 나란히 정렬되도록 살짝 아래로
            />
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold">Arrival Time Based Matching</Text>
              <Text
                fontSize="sm"
                color="gray.500"
                lineHeight="1.5" // 줄 간격 조정
              >
                The selected time is your desired arrival time. We'll calculate
                pickup times accordingly. Only drivers available on your
                selected date will be shown.
              </Text>
            </VStack>
          </HStack>

          <Stack spacing={6}>
            {" "}
            {/* 각 섹션 사이 간격 */}
            <HStack spacing={3} align="start">
              <Icon as={FaRoute} color={iconColor} boxSize={5} mt={1} />
              <VStack align="start" spacing={1}>
                <Text fontWeight="semibold">Optimized Route System</Text>
                <Text fontSize="sm" color="gray.500" lineHeight="1.5">
                  We provide the most efficient route based on all selected
                  passengers' locations traveling on the same date. The system
                  automatically calculates pickup sequence for minimal travel
                  time.
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={3} align="start">
              <Icon as={FaUserFriends} color={iconColor} boxSize={5} mt={1} />
              <VStack align="start" spacing={1}>
                <Text fontWeight="semibold">Maximum Passengers: 5</Text>
                <Text fontSize="sm" color="gray.500" lineHeight="1.5">
                  During the beta phase, we're limiting to 5 passengers per ride
                  due to API limitations.
                </Text>
              </VStack>
            </HStack>
          </Stack>
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
