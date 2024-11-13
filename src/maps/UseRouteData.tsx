import { useState, useEffect } from "react";
import { reverseGeocode } from "../api/Geocoding";
import { getEndCoordinates, getStartCoordinates } from "./RouteMap";

export interface PassengerDetail {
  name: string;
  pickup: string;
  time: string;
}

export interface LocationData {
  origin: string;
  destination: string;
  waypoints: {
    location: string;
    stopover: boolean;
  }[];
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

export interface PickupTime {
  location: string;
  time: string;
}

export const useRouteData = (passengerDetails: PassengerDetail[]) => {
  const [startPoint, setStartPoint] = useState<string>("");
  const [endPoint, setEndPoint] = useState<string>("");
  const [locationData, setLocationData] = useState<LocationData>({
    origin: "",
    destination: "",
    waypoints: [],
    labels: {
      origin: "",
      destination: "",
      passengers: [],
    },
  });

  // Get coordinates once when the hook is initialized
  const startCoordinates = getStartCoordinates();
  const endCoordinates = getEndCoordinates();

  // First useEffect to fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (startCoordinates && endCoordinates) {
          const [start, end] = await Promise.all([
            reverseGeocode(startCoordinates.lat, startCoordinates.lng),
            reverseGeocode(endCoordinates.lat, endCoordinates.lng),
          ]);

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

    if (startCoordinates && endCoordinates) {
      fetchAddresses();
    }
  }, [startCoordinates, endCoordinates]);

  // Second useEffect to update locationData
  useEffect(() => {
    if (!startPoint || !endPoint) return;

    const newLocationData: LocationData = {
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

    setLocationData(newLocationData);
  }, [startPoint, endPoint, passengerDetails]); // Remove coordinates from dependencies

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
