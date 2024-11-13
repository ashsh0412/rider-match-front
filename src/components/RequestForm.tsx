import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaMapPin } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "./DatePicker";
import { sendLocationToBackend } from "../api/PostLocation";
import { useLocation } from "react-router-dom";
import DriverInfo from "./DriverPageInfo";

interface RideRequestFormProps {
  onSuccess: () => void;
}

export const formatDateTime = (date: Date | null): string => {
  const targetDate = date || new Date();
  return targetDate.toISOString().slice(0, 19).replace("T", " ");
};

export const formatEnglishDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
};

export const RideRequestForm: React.FC<RideRequestFormProps> = ({
  onSuccess,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();
  const isRiderPage = location.pathname === "/rider-page";
  const mainText = isRiderPage ? "Request a Ride" : "Find Passengers";
  const firstInput = isRiderPage ? "Pickup Location" : "Your Location";

  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputHoverBg = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.500", "gray.400");

  const toast = useToast();

  const handleFindLocation = async () => {
    try {
      setIsSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving location:", error);

      // 에러 토스트
      toast({
        title: "Request Failed",
        description: "Fill out all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        containerStyle: {
          width: "100%",
          maxWidth: "400px",
        },
      });
    }
  };

  const handleSaveLocation = async () => {
    try {
      const formattedDate = formatDateTime(startDate);
      await sendLocationToBackend(formattedDate);
      setIsSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving location:", error);

      // 에러 토스트
      toast({
        title: "Request Failed",
        description: "Enter a valid address to continue.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        containerStyle: {
          width: "100%",
          maxWidth: "400px",
        },
      });
    }
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {mainText}
      </Text>
      <Box position="relative">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaMapMarkerAlt color={iconColor} />
          </InputLeftElement>
          <Input
            id="pickup-location"
            placeholder={firstInput}
            size="lg"
            bg={inputBg}
            border="none"
            pl="40px"
            _hover={{ bg: inputHoverBg }}
            _focus={{ bg: inputHoverBg, boxShadow: "none" }}
          />
        </InputGroup>
      </Box>
      <Box position="relative">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaMapPin color={iconColor} />
          </InputLeftElement>
          <Input
            id="dropoff-location"
            placeholder="Destination"
            size="lg"
            bg={inputBg}
            pl="40px"
            border="none"
            _hover={{ bg: inputHoverBg }}
            _focus={{ bg: inputHoverBg, boxShadow: "none" }}
          />
        </InputGroup>
      </Box>

      <CustomDatePicker
        value={startDate}
        onChange={(date) => setStartDate(date)}
        iconColor={iconColor}
        inputBg={inputBg}
        inputHoverBg={inputHoverBg}
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="50px"
        w="100%"
        bg={inputBg}
        _hover={{ bg: inputHoverBg }}
        cursor="pointer"
        borderRadius="0.375rem"
        fontWeight="medium"
        fontSize="lg"
        onClick={isRiderPage ? handleSaveLocation : handleFindLocation}
      >
        {mainText}
      </Box>
      {!isRiderPage && <DriverInfo />}
    </>
  );
};

export default RideRequestForm;
