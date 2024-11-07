import Cookies from "js-cookie";
import { getStartCoordinates, getEndCoordinates } from "../maps/RouteMap";
import { getCurrentUser } from "./GetUserInfo";
import { reverseGeocode } from "./Geocoding";

// LocationData 인터페이스를 export하여 다른 파일에서 사용 가능하게 함
export interface LocationData {
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  first_name: string;
  last_name: string;
  user: number;
  date_time: string;
  pickup_location: string;
  dropoff_location: string;
}

// 위치 데이터 생성 함수를 export하여 재사용 가능하게 함
export const createLocationData = async (
  date_time: string
): Promise<LocationData> => {
  const user = await getCurrentUser();
  const startLocation = getStartCoordinates();
  const endLocation = getEndCoordinates();
  const pickUpAddress = await reverseGeocode(
    startLocation.lat,
    startLocation.lng
  );
  const destination = await reverseGeocode(endLocation.lat, endLocation.lng);

  if (!startLocation || !endLocation) {
    throw new Error("Location coordinates not found");
  }

  return {
    start_latitude: startLocation.lat,
    start_longitude: startLocation.lng,
    end_latitude: endLocation.lat,
    end_longitude: endLocation.lng,
    first_name: user.first_name,
    last_name: user.last_name,
    user: user.id,
    date_time: date_time,
    pickup_location: pickUpAddress,
    dropoff_location: destination,
  };
};

export const sendLocationToBackend = async (
  date_time: string
): Promise<void> => {
  try {
    const locationData = await createLocationData(date_time);

    const response = await fetch("http://127.0.0.1:8000/api/v1/locations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include",
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      throw new Error("Failed to save location data");
    }

    console.log("Location saved successfully");
  } catch (error) {
    console.error("Error saving location:", error);
    throw error;
  }
};
