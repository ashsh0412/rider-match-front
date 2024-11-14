import React from "react";
import { Box, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { FaHistory } from "react-icons/fa";

const RecentLocations: React.FC = () => {
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const inputHoverBg = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const bgColor = useColorModeValue("white", "gray.800");

  // recentLocations 데이터를 컴포넌트 내부에 정의
  const recentLocations = [
    { title: "집", address: "서울시 강남구 역삼동" },
    { title: "회사", address: "서울시 서초구 서초동" },
    { title: "학교", address: "서울시 관악구 신림동" },
  ];

  return (
    <Box mt={6}>
      <HStack mb={3}>
        <FaHistory />
        <Text fontWeight="bold">Recent Locations</Text>
      </HStack>
      <VStack
        spacing={3}
        align="stretch"
        bg={sectionBg}
        p={4}
        borderRadius="md"
      >
        {recentLocations.map((location, index) => (
          <Box
            key={index}
            p={3}
            bg={bgColor}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: inputHoverBg }}
          >
            <Text fontWeight="semibold">{location.title}</Text>
            <Text fontSize="sm" color={iconColor}>
              {location.address}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default RecentLocations;
