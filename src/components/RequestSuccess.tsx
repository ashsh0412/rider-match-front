import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  useColorModeValue,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { createLocationData } from "../API/PostLocation";
import { optLocations } from "../API/OptLocation";
import { reverseGeocode } from "../API/Geocoding";
import PageNavigation from "./PageNavigation";
import RouteMap from "../maps/OptRoute";
import { Passenger, SuccessMessageProps } from "../type";
import { PassengerCard } from "./PassengerCard";

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  setIsSuccess,
  setOptRoute,
}) => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOptRoute, setIsOptRoute] = useState(false);
  const [selectedPassengerDetails, setSelectedPassengerDetails] = useState<
    Passenger[]
  >([]); // 추가된 state
  const itemsPerPage = 2;

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const successColor = useColorModeValue("green.500", "green.300");
  const warningColor = useColorModeValue("yellow.500", "yellow.300");

  const location = useLocation();
  const isRiderPage = location.pathname === "/rider-page";
  const hasNoPassengers = passengers.length === 0;
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([]);

  const handlePassengerSelect = (id: number) => {
    setSelectedPassengers((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((passengerId) => passengerId !== id); // 선택 해제
      } else if (prevSelected.length < 5) {
        return [...prevSelected, id]; // 최대 5명까지 선택
      }
      return prevSelected;
    });
  };

  // 상태에 따른 색상과 아이콘 설정
  const getStatusConfig = () => {
    if (isRiderPage) {
      return {
        icon: FaCheckCircle,
        color: successColor,
      };
    }

    if (hasNoPassengers) {
      return {
        icon: FaExclamationTriangle,
        color: warningColor,
      };
    }

    return {
      icon: FaCheckCircle,
      color: successColor,
    };
  };

  const statusConfig = getStatusConfig();

  const mainMessage = isRiderPage
    ? "Ride Request Successful!"
    : hasNoPassengers
    ? "No Available Requests"
    : "New Ride Requests Available!";

  const description = isRiderPage
    ? "Your ride request has been submitted successfully. We will notify you when a driver accepts your request."
    : hasNoPassengers
    ? "There are currently no ride requests in your area."
    : "Select passengers to accept their ride request.";

  const subDescription = isRiderPage
    ? "You can check the status of your ride in the notifications."
    : hasNoPassengers
    ? "Please check back later for new ride requests."
    : null;

  const getCurrentPagePassengers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return passengers.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(passengers.length / itemsPerPage);

  const initializePassengers = async () => {
    setIsLoading(true);
    try {
      const savedDate = sessionStorage.getItem("selectedDate");
      let targetDate: string = "";

      if (savedDate) {
        // savedDate가 string일 때 Date로 변환 후, 문자열로 변환
        const dateObj = new Date(savedDate);
        targetDate = dateObj.toISOString(); // ISO 형식으로 날짜를 string으로 변환
      }

      const userInfo = await createLocationData(targetDate);

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
        const optInfo = await optLocations();

        if (optInfo && Array.isArray(optInfo)) {
          if (optInfo.length > 0) {
            const maxPassengers = 10;
            const newPassengers = optInfo
              .slice(0, maxPassengers)
              .map((passenger, index) => ({
                id: passenger.id || index + 1,
                name: `${passenger.first_name} ${passenger.last_name}`,
                pickup: passenger.pickup_location,
                destination: passenger.dropoff_location,
                time: passenger.date_time,
              }));
            const selectedDate = sessionStorage.getItem("selectedDate");
            if (selectedDate) {
              const selectedDateObj = new Date(selectedDate); // 선택된 날짜를 Date 객체로 변환
              const currentTime = new Date(); // 현재 시간을 가져옴

              // 선택된 날짜의 시작 시간과 끝 시간을 정의 (00:00:00 - 23:59:59)
              const startOfDay = new Date(selectedDateObj);
              startOfDay.setHours(0, 0, 0, 0); // 선택된 날짜의 00:00:00

              const endOfDay = new Date(selectedDateObj);
              endOfDay.setHours(23, 59, 59, 999); // 선택된 날짜의 23:59:59

              const filteredPassengers = newPassengers.filter((passenger) => {
                const passengerTime = new Date(passenger.time); // 승객의 시간을 Date 객체로 변환

                // 승객의 시간이 선택된 날짜에 속하는지 확인
                return (
                  passengerTime >= startOfDay &&
                  passengerTime <= endOfDay &&
                  passengerTime > currentTime // 현재 시간보다 미래인 승객만
                );
              });

              setPassengers(filteredPassengers);
            }
          } else {
            setPassengers([]);
          }
        } else {
          setPassengers([]);
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

  const handleButtonClick = async () => {
    if (isRiderPage) {
      localStorage.removeItem("endCoordinates");
      localStorage.removeItem("startCoordinates");
      window.location.reload();
    } else if (hasNoPassengers) {
      window.location.reload();
    } else {
      const selectedPassengerDetails = passengers.filter((p) =>
        selectedPassengers.includes(p.id)
      );
      localStorage.setItem(
        "selectedPassengerDetails",
        JSON.stringify(selectedPassengerDetails)
      );
      setSelectedPassengerDetails(selectedPassengerDetails);
      setIsOptRoute(true);
      if (setOptRoute) {
        setOptRoute((prev) => !prev);
      }
    }
  };

  const getButtonConfig = () => {
    if (isRiderPage) {
      return {
        text: "Done",
        isDisabled: false,
      };
    }

    if (hasNoPassengers) {
      return {
        text: "Search Again",
        isDisabled: false,
      };
    }

    return {
      text: "Accept",
      isDisabled: selectedPassengers.length === 0,
    };
  };

  const buttonConfig = getButtonConfig();

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
        {isOptRoute ? (
          <RouteMap passengerDetails={selectedPassengerDetails} />
        ) : (
          <>
            <Icon
              as={statusConfig.icon}
              w={12}
              h={12}
              color={statusConfig.color}
            />
            <Box fontSize="xl" fontWeight="bold" color={statusConfig.color}>
              {mainMessage}
            </Box>
            <Box color={textColor} textAlign="center">
              {description}
            </Box>
            <Box fontSize="sm" color={textColor} textAlign="center" mb={4}>
              {subDescription}
            </Box>

            {!isRiderPage && passengers.length > 0 && (
              <VStack spacing={4} w="100%">
                {getCurrentPagePassengers().map((passenger) => (
                  <PassengerCard
                    key={passenger.id}
                    passenger={passenger}
                    isSelected={selectedPassengers.includes(passenger.id)}
                    onClick={() => handlePassengerSelect(passenger.id)}
                  />
                ))}

                {passengers.length > itemsPerPage && (
                  <PageNavigation
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
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
              isDisabled={buttonConfig.isDisabled}
              onClick={handleButtonClick}
            >
              {buttonConfig.text}
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default SuccessMessage;
