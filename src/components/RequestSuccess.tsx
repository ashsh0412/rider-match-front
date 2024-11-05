import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const SuccessMessage = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const successColor = useColorModeValue("green.500", "green.300");

  // 현재 경로를 가져오기 위해 useLocation 사용
  const location = useLocation();

  // 경로에 따라 메시지 내용 설정
  const isRiderPage = location.pathname === "/rider-page";
  const mainMessage = isRiderPage
    ? "Ride Request Successful!"
    : "Offer Successfully Submitted!";
  const description = isRiderPage
    ? "Your ride request has been submitted successfully. We will notify you when a driver accepts your request."
    : "Your ride offer has been posted successfully. Riders will be able to see your offer and accept it.";
  const subDescription = isRiderPage
    ? "You can check the status of your ride in the notifications."
    : "Manage your offers and view requests from interested riders.";

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" w="100%">
      <VStack spacing={4} align="center">
        <FaCheckCircle size="48px" color={successColor} />
        <Box fontSize="xl" fontWeight="bold" color={successColor}>
          {mainMessage}
        </Box>
        <Box color={textColor} textAlign="center">
          {description}
        </Box>
        <Box fontSize="sm" color={textColor} textAlign="center">
          {subDescription}
        </Box>
      </VStack>
    </Box>
  );
};

export default SuccessMessage;
