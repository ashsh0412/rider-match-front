import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  Card,
  CardBody,
  Container,
} from "@chakra-ui/react";
import { getEndCoordinates, getStartCoordinates } from "./RouteMap";
import { reverseGeocode } from "../api/Geocoding";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

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

const RouteMap: React.FC<RouteMapProps> = ({ passengerDetails }) => {
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const [startPoint, setStartPoint] = useState<string>("");
  const [endPoint, setEndPoint] = useState<string>("");

  const startCoordinates = getStartCoordinates();
  const endCoordinates = getEndCoordinates();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (startCoordinates && endCoordinates) {
          const start = await reverseGeocode(
            startCoordinates.lat,
            startCoordinates.lng
          );
          const end = await reverseGeocode(
            endCoordinates.lat,
            endCoordinates.lng
          );
          setStartPoint(start);
          setEndPoint(end);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setStartPoint(
          startCoordinates
            ? `${startCoordinates.lat}, ${startCoordinates.lng}`
            : ""
        );
        setEndPoint(
          endCoordinates ? `${endCoordinates.lat}, ${endCoordinates.lng}` : ""
        );
      }
    };

    fetchAddresses();
  }, [startCoordinates, endCoordinates]);

  const locationData = {
    origin: startCoordinates
      ? `${startCoordinates.lat},${startCoordinates.lng}`
      : "",
    destination: endCoordinates
      ? `${endCoordinates.lat},${endCoordinates.lng}`
      : "",
    waypoints:
      passengerDetails?.map((passenger) => ({
        location: passenger.pickup,
        stopover: true,
      })) || [],
    labels: {
      origin: startPoint,
      destination: endPoint,
      passengers:
        passengerDetails?.map((p) => ({
          name: p.name,
          scheduledTime: new Date(p.time).toLocaleString(),
          pickup: p.pickup,
        })) || [],
    },
  };

  const calculatePickupTimes = (
    legs: google.maps.DirectionsLeg[]
  ): PickupTime[] => {
    let currentTime = new Date();
    const pickupTimes: PickupTime[] = [];
    let cumulativeDuration = 0;

    try {
      for (let i = 0; i < legs.length - 1; i++) {
        const durationValue = Number(legs[i]?.duration?.value ?? 0);
        if (isNaN(durationValue) || durationValue === 0) {
          console.warn(`Invalid or missing duration value for leg ${i}`);
          continue;
        }

        cumulativeDuration += durationValue;

        const pickupTime = new Date(
          currentTime.getTime() + cumulativeDuration * 1000
        );

        pickupTimes.push({
          location: legs[i]?.end_address || "",
          time: pickupTime.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    } catch (error) {
      console.error("Error calculating pickup times:", error);
    }

    return pickupTimes;
  };

  useEffect(() => {
    try {
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });

      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 13,
          center: { lat: 29.6516, lng: -82.3248 },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        }
      );

      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(map);
      }

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
          .then((response) => {
            if (directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(response);

              // 마커를 위한 데이터 준비
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

                panel.innerHTML = `
                <div style="margin-top: 10px;">
                  <p><strong>Total Distance:</strong> ${(
                    totalDistance / 1609.34
                  ).toFixed(1)} miles</p>
                  <p><strong>Total Duration:</strong> ${Math.round(
                    totalDuration / 60
                  )} mins</p>
                  <div style="margin-top: 15px;">
                    <p><strong>Pickup Schedule:</strong></p>
                    ${pickupSchedule}
                  </div>
                </div>
              `;
              }

              // 마커 클러스터링 및 마커 생성
              const locations = [
                { address: locationData.origin, name: "Driver Location" },
                ...locationData.waypoints.map((wp, i) => ({
                  address: wp.location,
                  name: `Pickup ${i + 1}`,
                })),
                {
                  address: locationData.destination,
                  name: "Final Destination",
                },
              ];

              const geocoder = new google.maps.Geocoder();
              const markers: google.maps.Marker[] = [];

              locations.forEach((loc, index) => {
                geocoder.geocode(
                  { address: loc.address },
                  (results, status) => {
                    if (status === "OK" && results && results[0]) {
                      const marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        label: {
                          text: (index + 1).toString(),
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        },
                      });
                      markers.push(marker);
                    }
                  }
                );
              });

              // 마커 클러스터링
              new MarkerClusterer({ map, markers });
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
  }, [passengerDetails, locationData]);

  return (
    <Container maxW="container.lg" p={0}>
      <VStack spacing={6} align="stretch">
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
            <Box id="route-info" mt={6}></Box>
            <div id="map" style={{ height: "400px" }}></div>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default RouteMap;
