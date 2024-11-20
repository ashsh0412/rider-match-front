import React, { useEffect, useRef } from "react";
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

// 경로 계산을 위한 커스텀 훅
const useRouteCalculation = ({
  locationData,
  passengerDetails,
  calculatePickupTimes,
}: UseRouteCalculationProps) => {
  // Google Maps Directions 서비스와 렌더러를 위한 ref
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

  useEffect(() => {
    // 필요한 데이터가 모두 있는지 확인
    if (
      !locationData.origin ||
      !locationData.destination ||
      !passengerDetails.length
    ) {
      return;
    }

    try {
      // Google Maps 서비스 초기화
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // 기본 마커 숨기기
      });

      if (directionsServiceRef.current && directionsRendererRef.current) {
        // 경로 계산을 위한 요청 설정
        const request: google.maps.DirectionsRequest = {
          origin: locationData.origin,
          destination: locationData.destination,
          waypoints: locationData.waypoints,
          optimizeWaypoints: true, // 경유지 최적화
          travelMode: google.maps.TravelMode.DRIVING,
          region: "us",
          language: "en",
        };

        // 경로 계산 실행
        directionsServiceRef.current
          .route(request)
          .then(async (response) => {
            if (directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(response);

              const route = response.routes[0];
              const legs = route.legs;
              const pickupTimes = calculatePickupTimes(legs);

              // 총 거리와 시간 계산
              let totalDistance = 0;
              let totalDuration = 0;

              legs.forEach((leg) => {
                if (leg?.distance?.value)
                  totalDistance += Number(leg.distance.value);
                if (leg?.duration?.value)
                  totalDuration += Number(leg.duration.value);
              });
              // 경로 정보 패널 업데이트
              const panel = document.getElementById("route-info");
              if (panel) {
                // 승객별 픽업 일정 HTML 생성
                const pickupSchedule = passengerDetails
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

                // 로컬 스토리지에서 선택된 승객 정보 가져오기
                const data = localStorage.getItem("selectedPassengerDetails");
                const riderInfo = await getCurrentUser();

                // 예약 데이터 생성 및 저장
                if (data) {
                  const parsedData = JSON.parse(data);

                  if (Array.isArray(parsedData)) {
                    // Django 모델에 맞는 예약 데이터 구조 생성
                    const startCoordinates =
                      localStorage.getItem("startCoordinates");

                    let startingPoint = "";
                    if (startCoordinates) {
                      try {
                        const parsedCoordinates = JSON.parse(startCoordinates);
                        const latitude = parsedCoordinates.lat;
                        const longitude = parsedCoordinates.lng;

                        // reverseGeocode 함수로 주소 변환
                        startingPoint = await reverseGeocode(
                          latitude,
                          longitude
                        );
                      } catch (error) {
                        console.error("Error parsing startCoordinates:", error);
                      }
                    }

                    // 예약 데이터 생성
                    const bookingData: BookingData = {
                      rider: riderInfo.id,
                      driver_name: `${riderInfo.first_name} ${riderInfo.last_name}`,
                      passengers: await Promise.all(
                        parsedData.map(async (item: PassengerDetail) => {
                          const id = await getLocationsById(item.id); // passenger의 아이디 정보를 보냄
                          return {
                            id: id, // 단일 숫자 id를 사용
                            name: item.name,
                          };
                        })
                      ),

                      pickup_times: parsedData.map(
                        (_, index) => pickupTimes[index]?.time || "N/A"
                      ),
                      locations: {
                        pickups: parsedData.map(
                          (item: PassengerDetail) => item.pickup
                        ),
                        destinations: parsedData.map(
                          (item: PassengerDetail) => item.destination
                        ),
                      },
                      guests: parsedData.length,
                      created_at: new Date().toISOString(),
                      arrival_time:
                        sessionStorage.getItem("selectedDate") ||
                        new Date().toISOString(),
                      starting_point: startingPoint || "Unknown Location",
                    };

                    try {
                      await PostBooking(bookingData);
                      await Promise.all(
                        parsedData.map(async (passenger: Passenger) => {
                          deleteLocation({
                            id: passenger.id.toString(),
                          });
                        })
                      );
                    } catch (error) {
                      console.error("Error in booking flow:", error);
                    }
                  }
                }

                // 총 소요 시간을 시간과 분으로 변환
                const totalDurationInMinutes = totalDuration / 60;
                const totalHours = Math.floor(totalDurationInMinutes / 60);
                const remainingMinutes = Math.round(
                  totalDurationInMinutes % 60
                );

                // 경로 정보 패널 HTML 업데이트
                panel.innerHTML = `
                   <div style="margin-top: 10px;">
                     <p><strong>Total Distance:</strong> ${(
                       totalDistance / 1609.34
                     ).toFixed(1)} miles</p>
                     <p><strong>Total Duration:</strong> ${
                       totalHours === 0 ? "" : totalHours
                     } ${totalHours !== 0 ? "hour" : ""}${
                  totalHours > 0 ? "s" : ""
                } ${remainingMinutes} minute${
                  remainingMinutes !== 1 ? "s" : ""
                }</p>
                     <div style="margin-top: 15px;">
                       <p><strong>Pickup Schedule:</strong></p>
                       ${pickupSchedule}
                     </div>
                   </div>
                 `;
              }
            }
          })
          .catch((e: Error) => {
            console.error("Error calculating route:", e);
            const panel = document.getElementById("route-info");
            if (panel) {
              panel.innerHTML = `<p style="color: red;">Failed to calculate route. Please check the addresses.</p>`;
            }
          });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [locationData, passengerDetails, calculatePickupTimes]);

  return {
    directionsService: directionsServiceRef.current,
    directionsRenderer: directionsRendererRef.current,
  };
};

// 경로 지도 렌더러 컴포넌트 props 인터페이스

// 패널 렌더러 컴포넌트
const PanelRenderer: React.FC<RouteMapRendererProps> = ({
  locationData,
  calculatePickupTimes,
  passengerDetails,
}) => {
  useRouteCalculation({
    locationData,
    passengerDetails,
    calculatePickupTimes,
  });
  return <div />;
};

// 메인 RouteMap 컴포넌트
const RouteMap: React.FC<RouteMapProps> = ({ passengerDetails }) => {
  const { startPoint, endPoint, locationData, calculatePickupTimes } =
    useRouteData(passengerDetails);
  const navigate = useNavigate();

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
        <Button
          onClick={() => {
            // 라이더 페이지로 이동하고 로컬 스토리지 데이터 정리
            navigate("/rider-page");
            localStorage.removeItem("endCoordinates");
            localStorage.removeItem("startCoordinates");
            localStorage.removeItem("selectedPassengerDetails");
          }}
        >
          Done
        </Button>
      </VStack>
    </Container>
  );
};

export default RouteMap;
