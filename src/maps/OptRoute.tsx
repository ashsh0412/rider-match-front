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

interface Location {
  address: string;
  name: string;
}

// useRouteData hook
const useRouteData = (passengerDetails: PassengerDetail[]) => {
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

  const locationData: LocationData = {
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

  return {
    startPoint,
    endPoint,
    locationData,
    calculatePickupTimes,
  };
};

// useRouteCalculation hook
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
          .then((response) => {
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

// RouteMapRenderer component
interface RouteMapRendererProps {
  locationData: LocationData;
  calculatePickupTimes: (legs: google.maps.DirectionsLeg[]) => PickupTime[];
  passengerDetails: PassengerDetail[];
}

const RouteMapRenderer: React.FC<RouteMapRendererProps> = ({
  locationData,
  calculatePickupTimes,
  passengerDetails,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const { directionsRenderer } = useRouteCalculation({
    locationData,
    passengerDetails,
    calculatePickupTimes,
  });

  useEffect(() => {
    const mapElement = document.querySelector(".map-container") as HTMLElement;
    if (!mapElement || !directionsRenderer) return;

    mapInstanceRef.current = new google.maps.Map(mapElement, {
      zoom: 13,
      center: { lat: 29.6516, lng: -82.3248 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    if (directionsRenderer) {
      directionsRenderer.setMap(mapInstanceRef.current);
    }

    const locations: Location[] = [
      { address: locationData.origin, name: "Driver Location" },
      ...locationData.waypoints.map(
        (wp: Waypoint, i: number): Location => ({
          address: wp.location,
          name: `Pickup ${i + 1}`,
        })
      ),
      {
        address: locationData.destination,
        name: "Final Destination",
      },
    ];

    const geocoder = new google.maps.Geocoder();
    const markers: google.maps.Marker[] = [];

    locations.forEach((loc, index) => {
      geocoder.geocode({ address: loc.address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: mapInstanceRef.current,
            label: {
              text: (index + 1).toString(),
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
            },
          });
          markers.push(marker);
        }
      });
    });

    if (markers.length > 0) {
      new MarkerClusterer({
        map: mapInstanceRef.current,
        markers,
      });
    }
  }, [directionsRenderer, locationData]);

  return (
    <div
      ref={mapRef}
      className="map-container"
      style={{ width: "100%", height: "400px" }}
    />
  );
};

// Main RouteMap component
const RouteMap: React.FC<RouteMapProps> = ({ passengerDetails }) => {
  const { startPoint, endPoint, locationData, calculatePickupTimes } =
    useRouteData(passengerDetails);

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
            <Box id="route-info" />
          </CardBody>
        </Card>
        <RouteMapRenderer
          locationData={locationData}
          calculatePickupTimes={calculatePickupTimes}
          passengerDetails={passengerDetails}
        />
      </VStack>
    </Container>
  );
};

export default RouteMap;
