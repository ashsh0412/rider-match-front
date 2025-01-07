import { useState, useEffect } from "react";
import { reverseGeocode } from "../API/Geocoding";
import { getEndCoordinates, getStartCoordinates } from "./RouteMap";
import {
  LocationDataForRouteData,
  PassengerDetailForRouteData,
  PickupTime,
} from "../type";

export const useRouteData = (
  passengerDetails: PassengerDetailForRouteData[]
) => {
  const [startPoint, setStartPoint] = useState<string>("");
  const [endPoint, setEndPoint] = useState<string>("");
  const [locationData, setLocationData] = useState<LocationDataForRouteData>({
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

    const newLocationData: LocationDataForRouteData = {
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
    const selectedDate = sessionStorage.getItem("selectedDate");
    let startTime = selectedDate ? new Date(selectedDate) : new Date();
    const pickupTimes: PickupTime[] = [];

    const formatTime = (date: Date) => {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    try {
      // 첫 번째 위치(출발지)
      pickupTimes.push({
        location: legs[0]?.start_address || "",
        time: formatTime(startTime),
      });

      let currentTime = startTime.getTime();

      // 각 구간별 시간 계산
      for (let i = 0; i < legs.length; i++) {
        const durationInMinutes = Number(legs[i]?.duration?.value ?? 0) / 60;

        if (isNaN(durationInMinutes) || durationInMinutes === 0) {
          console.warn(`Invalid or missing duration value for leg ${i}`);
          continue;
        }

        currentTime += durationInMinutes * 60 * 1000;

        pickupTimes.push({
          location: legs[i]?.end_address || "",
          time: formatTime(new Date(currentTime)),
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
