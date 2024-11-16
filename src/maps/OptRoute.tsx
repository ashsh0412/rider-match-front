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
import { Passenger } from "../components/PassengerCard";
import { getCurrentUser } from "../api/GetUserInfo";
import { PostBooking } from "../api/PostBooking";

interface PassengerDetail {
  id: number;
  name: string;
  pickup: string;
  destination: string;
  time: string;
}

interface RouteMapProps {
  passengerDetails: PassengerDetail[];
}

interface PickupTime {
  location: string;
  time: string;
}

interface Waypoint {
  location: string;
  stopover: boolean;
}

interface LocationData {
  origin: string;
  destination: string;
  waypoints: Waypoint[];
  labels: {
    origin: string;
    destination: string;
    passengers: {
      name: string;
      scheduledTime: string;
      pickup: string;
    }[];
  };
}

interface UseRouteCalculationProps {
  locationData: LocationData;
  passengerDetails: PassengerDetail[];
  calculatePickupTimes: (legs: google.maps.DirectionsLeg[]) => PickupTime[];
}

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

  useEffect(() => {
    // Ensure that necessary data is present before initializing map calculation
    if (
      !locationData.origin ||
      !locationData.destination ||
      !passengerDetails.length
    ) {
      return;
    }

    try {
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });

      if (directionsServiceRef.current && directionsRendererRef.current) {
        const request: google.maps.DirectionsRequest = {
          origin: locationData.origin,
          destination: locationData.destination,
          waypoints: locationData.waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING,
          region: "us",
          language: "en",
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        };

        directionsServiceRef.current
          .route(request)
          .then(async (response) => {
            if (directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(response);

              const route = response.routes[0];
              const legs = route.legs;
              const pickupTimes = calculatePickupTimes(legs);

              let totalDistance = 0;
              let totalDuration = 0;

              legs.forEach((leg) => {
                if (leg?.distance?.value)
                  totalDistance += Number(leg.distance.value);
                if (leg?.duration?.value)
                  totalDuration += Number(leg.duration.value);
              });

              const panel = document.getElementById("route-info");
              if (panel) {
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
                const data = localStorage.getItem("selectedPassengerDetails");
                const riderInfo = await getCurrentUser();
                if (data) {
                  const parsedData = JSON.parse(data);
                  if (Array.isArray(parsedData)) {
                    // Django 모델 구조에 맞게 데이터 변환
                    const bookingData = {
                      rider: riderInfo.id,
                      driver_name: riderInfo.first_name + riderInfo.last_name,
                      passengers: parsedData.map((item: Passenger) => ({
                        id: item.id,
                        name: item.name,
                      })),
                      pickup_times: parsedData.map(
                        (_, index) => pickupTimes[index]?.time || "N/A"
                      ),
                      locations: {
                        pickups: parsedData.map(
                          (item: Passenger) => item.pickup
                        ),
                        destinations: parsedData.map(
                          (item: Passenger) => item.destination
                        ),
                      },
                      guests: parsedData.length,
                      created_at: new Date().toISOString(),
                    };
                    PostBooking(bookingData);
                  }
                }
                const totalDurationInMinutes = totalDuration / 60; // minutes로 변환
                const totalHours = Math.floor(totalDurationInMinutes / 60); // 시간 계산
                const remainingMinutes = Math.round(
                  totalDurationInMinutes % 60
                ); // 나머지 분 계산

                panel.innerHTML = `
                   <div style="margin-top: 10px;">
                     <p><strong>Total Distance:</strong> ${(
                       totalDistance / 1609.34
                     ).toFixed(1)} miles</p>
                         <p><strong>Total Duration:</strong> ${
                           totalHours == 0 ? "" : totalHours
                         } ${totalHours != 0 ? "hour" : ""}${
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

interface RouteMapRendererProps {
  locationData: LocationData;
  calculatePickupTimes: (legs: google.maps.DirectionsLeg[]) => PickupTime[];
  passengerDetails: PassengerDetail[];
}

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
