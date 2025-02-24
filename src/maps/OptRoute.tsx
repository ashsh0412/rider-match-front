import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  Card,
  CardBody,
  Container,
  Button,
} from "@chakra-ui/react";
import { useRouteData } from "./UseRouteData";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/GetUserInfo";
import { PostBooking } from "../API/PostBooking";
import { reverseGeocode } from "../API/Geocoding";
import { getLocationsById } from "../API/GetSpecificLocation";
import {
  BookingData,
  Passenger,
  PassengerDetail,
  RouteMapProps,
  RouteMapRendererProps,
  UseRouteCalculationProps,
} from "../type";
import { deleteLocation } from "../API/DeleteLocation";

// 커스텀 훅: 경로 계산 및 상태 관리
const useRouteCalculation = ({
  locationData,
  passengerDetails,
  calculatePickupTimes,
}: UseRouteCalculationProps) => {
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const [routeInfo, setRouteInfo] = useState<string>("");
  const [optimizedPassengers, setOptimizedPassengers] = useState<
    PassengerDetail[]
  >([]);

  useEffect(() => {
    if (
      !locationData.origin ||
      !locationData.destination ||
      passengerDetails.length === 0
    ) {
      return;
    }

    const calculateRoute = async () => {
      try {
        if (!directionsServiceRef.current) {
          directionsServiceRef.current = new google.maps.DirectionsService();
        }
        if (!directionsRendererRef.current) {
          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
          });
        }

        const request: google.maps.DirectionsRequest = {
          origin: locationData.origin,
          destination: locationData.destination,
          waypoints: locationData.waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING,
          language: "en",
        };

        const response = await directionsServiceRef.current.route(request);
        directionsRendererRef.current.setDirections(response);

        const route = response.routes[0];
        const legs = route.legs;

        // 최적화된 waypoint 순서를 사용하여 승객 목록 재정렬
        const waypointOrder = route.waypoint_order;
        const reorderedPassengers = waypointOrder.map(
          (index) => passengerDetails[index]
        );
        setOptimizedPassengers(reorderedPassengers);

        // 재정렬된 승객 순서로 픽업 시간 계산
        const pickupTimes = calculatePickupTimes(legs);

        let totalDistance = 0;
        let totalDuration = 0;

        legs.forEach((leg) => {
          totalDistance += leg?.distance?.value || 0;
          totalDuration += leg?.duration?.value || 0;
        });

        const totalHours = Math.floor(totalDuration / 3600);
        const remainingMinutes = Math.round((totalDuration % 3600) / 60);

        // 최적화된 순서로 픽업 스케줄 표시
        const pickupSchedule = reorderedPassengers
          .map(
            (p, index) => `
            <div style="margin-top: 10px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <p><strong>Passenger ${index + 1}:</strong> ${p.name}</p>
              <p><strong>Pickup Location:</strong> ${p.pickup}</p>
              <p><strong>Estimated Pickup Time:</strong> ${
                pickupTimes[index]?.time || "N/A"
              }</p>
            </div>
          `
          )
          .join("");

        setRouteInfo(`
          <div style="margin-top: 10px;">
            <p><strong>Total Distance:</strong> ${(
              totalDistance / 1609.34
            ).toFixed(1)} miles</p>
            <p><strong>Total Duration:</strong> ${totalHours} hours ${
          remainingMinutes || 0
        } minutes</p>
            <div style="margin-top: 15px;">
              <p><strong>Optimized Pickup Schedule:</strong></p>
              ${pickupSchedule}
            </div>
          </div>
        `);

        // PostBooking 처리
        const data = localStorage.getItem("selectedPassengerDetails");
        const startCoordinates = localStorage.getItem("startCoordinates");
        if (data && startCoordinates) {
          try {
            const parsedCoordinates = JSON.parse(startCoordinates);
            const riderInfo = await getCurrentUser();

            const startingPoint = await reverseGeocode(
              parsedCoordinates.lat,
              parsedCoordinates.lng
            );

            // 모든 목적지가 같은지 확인
            const allSameDestination = reorderedPassengers.every(
              (passenger, _, array) =>
                passenger.destination === array[0].destination
            );

            const bookingData: BookingData = {
              rider: riderInfo.id,
              driver_name: `${riderInfo.first_name} ${riderInfo.last_name}`,
              passengers: await Promise.all(
                reorderedPassengers.map(async (item: PassengerDetail) => ({
                  id: await getLocationsById(item.id),
                  name: item.name,
                }))
              ),
              pickup_times: pickupTimes.map((time) => time?.time || "N/A"),
              locations: {
                pickups: reorderedPassengers.map(
                  (item: PassengerDetail) => item.pickup
                ),
                // 모든 목적지가 같은 경우 하나만 사용, 다른 경우 각각의 목적지 사용
                destinations: allSameDestination
                  ? [reorderedPassengers[0].destination]
                  : reorderedPassengers.map(
                      (item: PassengerDetail) => item.destination
                    ),
              },
              guests: reorderedPassengers.length,
              created_at: new Date().toISOString(),
              starting_point: startingPoint,
            };

            await PostBooking(bookingData);
            await Promise.all(
              reorderedPassengers.map((passenger: Passenger) =>
                deleteLocation({ id: passenger.id.toString() })
              )
            );
          } catch (error) {
            console.error("Error in booking flow:", error);
          }
        }
      } catch (error) {
        console.error("Error calculating route:", error);
        setRouteInfo(
          `<p style="color: red;">Failed to calculate route. Please check the addresses.</p>`
        );
      }
    };

    calculateRoute();
  }, [locationData, passengerDetails, calculatePickupTimes]);

  return {
    routeInfo,
    directionsRenderer: directionsRendererRef.current,
    optimizedPassengers,
  };
};

// 패널 렌더러 컴포넌트
const PanelRenderer: React.FC<RouteMapRendererProps> = ({
  locationData,
  calculatePickupTimes,
  passengerDetails,
}) => {
  const { routeInfo } = useRouteCalculation({
    locationData,
    passengerDetails,
    calculatePickupTimes,
  });

  return <Box dangerouslySetInnerHTML={{ __html: routeInfo }} />;
};

// 메인 RouteMap 컴포넌트
const RouteMap: React.FC<RouteMapProps> = ({ passengerDetails }) => {
  const { startPoint, endPoint, locationData, calculatePickupTimes } =
    useRouteData(passengerDetails);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/rider-page");
    localStorage.removeItem("endCoordinates");
    localStorage.removeItem("startCoordinates");
    localStorage.removeItem("selectedPassengerDetails");
  };

  return (
    <Container maxW="container.lg">
      <VStack spacing={2} align="stretch">
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Route Details
            </Heading>
            <Text mb={2}>
              <strong>Number of Pickups:</strong> {passengerDetails.length}
            </Text>
            <Text mb={2}>
              <strong>Start:</strong> {startPoint}
            </Text>
            <Text mb={2}>
              <strong>Final Destination:</strong> {endPoint}
            </Text>
            <Box id="route-info" />
          </CardBody>
        </Card>
        <PanelRenderer
          locationData={locationData}
          calculatePickupTimes={calculatePickupTimes}
          passengerDetails={passengerDetails}
        />
        <Button onClick={handleNavigate}>Done</Button>
      </VStack>
    </Container>
  );
};

export default RouteMap;
