import { useState, useEffect } from "react";
import { reverseGeocode } from "../api/Geocoding";
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
    let destinationTime = selectedDate ? new Date(selectedDate) : new Date(); // 도착 시간 기준으로 설정

    const pickupTimes: PickupTime[] = [];
    let cumulativeDuration = 0;

    try {
      for (let i = 0; i < legs.length - 1; i++) {
        const durationValue = Number(legs[i]?.duration?.value ?? 0);

        if (isNaN(durationValue) || durationValue === 0) {
          console.warn(`Invalid or missing duration value for leg ${i}`);
          continue;
        }

        // 누적 이동 시간을 더해서 예상 도착 시간을 계산
        cumulativeDuration += durationValue;
        const arrivalTime = new Date(
          destinationTime.getTime() - cumulativeDuration * 1000
        ); // 도착 시간에서 누적 시간을 빼서 픽업 시간 계산

        // 날짜와 시간 모두 추가
        pickupTimes.push({
          location: legs[i]?.end_address || "",
          time: arrivalTime.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
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
