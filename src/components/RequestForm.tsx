import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaMapPin, FaUserFriends } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "./DatePicker";
import { sendLocationToBackend } from "../api/PostLocation";
import { useLocation } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { getLocations } from "../api/GetLocation";
import { getEndCoordinates, getStartCoordinates } from "../maps/RouteMap";

interface RideRequestFormProps {
  onSuccess?: () => void;
}

const RideRequestForm: React.FC<RideRequestFormProps> = ({ onSuccess }) => {
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
      const locations = await getLocations(); // 한 번만 호출
      const startLocation = getStartCoordinates();
      const destination = getEndCoordinates();

      console.log(destination);

      const THRESHOLD = 0.0001;

      if (locations && locations.length > 0) {
        // destination과 비슷한 좌표를 가진 위치 데이터 필터링
        const matchingLocations = locations.filter((location) => {
          const latitudeDiff = Math.abs(
            location.end_latitude - destination.lat
          );
          const longitudeDiff = Math.abs(
            location.end_longitude - destination.lng
          );

          return latitudeDiff <= THRESHOLD && longitudeDiff <= THRESHOLD;
        });

        if (matchingLocations.length > 0) {
          console.log("가까운 위치 데이터:", matchingLocations);
          // 첫 번째 일치하는 데이터 사용
          const matchedLocation = matchingLocations[0];
          console.log("최종 위도:", matchedLocation.end_latitude);
          console.log("최종 경도:", matchedLocation.end_longitude);

          // 모든 일치하는 데이터 순회
          matchingLocations.forEach((location, index) => {
            console.log(`일치하는 위치 ${index + 1}:`, {
              latitude: location.end_latitude,
              longitude: location.end_longitude,
              name: `${location.first_name} ${location.last_name}`,
              address: location.address,
            });
          });
        } else {
          console.log("근처에 일치하는 위치 데이터가 없습니다.");
        }
        localStorage.removeItem("endCoordinates");
        localStorage.removeItem("startCoordinates");
      }

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
      await sendLocationToBackend();
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

      {!isRiderPage && (
        <Box position="relative" width="100%" borderRadius="0.375rem">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaUserFriends color={iconColor} />
            </InputLeftElement>
            <NumberInput
              defaultValue={1}
              border="none"
              min={1}
              max={5}
              size="lg"
              bg={inputBg}
              width="100%"
              borderRadius="0.375rem"
              _hover={{ bg: inputHoverBg }}
              _focus={{ bg: inputHoverBg, boxShadow: "none" }}
            >
              <NumberInputField
                border="none"
                pl="40px"
                borderRadius="0.375rem"
                placeholder="Select number of passengers"
              />
              <NumberInputStepper>
                <NumberIncrementStepper>
                  <ChevronUpIcon boxSize={4} />
                </NumberIncrementStepper>
                <NumberDecrementStepper>
                  <ChevronDownIcon boxSize={4} />
                </NumberDecrementStepper>
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
        </Box>
      )}

      <CustomDatePicker
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
    </>
  );
};

export default RideRequestForm;
