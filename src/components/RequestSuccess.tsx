import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const SuccessMessage = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const successColor = useColorModeValue("green.500", "green.300");

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" w="100%">
      <VStack spacing={4} align="center">
        <FaCheckCircle size="48px" color={successColor} />
        <Box fontSize="xl" fontWeight="bold" color={successColor}>
          Request Successful!
        </Box>
        <Box color={textColor} textAlign="center">
          Your ride request has been submitted successfully. We will notify you
          when a driver accepts your request.
        </Box>
        <Box fontSize="sm" color={textColor} textAlign="center">
          You can check the status of your ride in the notifications.
        </Box>
      </VStack>
    </Box>
  );
};

export default SuccessMessage;
