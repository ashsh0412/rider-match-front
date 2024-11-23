import Cookies from "js-cookie";
import { getStartCoordinates, getEndCoordinates } from "../maps/RouteMap";
import { getCurrentUser } from "./GetUserInfo";
import { reverseGeocode } from "./Geocoding";
import { BASE_URL, LocationData } from "../type";

// 위치 데이터 생성 함수를 export하여 재사용 가능하게 함
export const createLocationData = async (
  date_time: string
): Promise<LocationData> => {
  const user = await getCurrentUser();
  const startLocation = getStartCoordinates();
  const endLocation = getEndCoordinates();

  if (!startLocation || !endLocation) {
    throw new Error("Location coordinates not found");
  }

  // 간단히 경로가 존재하는지만 확인
  const isDriveable = await new Promise<boolean>((resolve) => {
    new google.maps.DirectionsService().route(
      {
        origin: new google.maps.LatLng(startLocation.lat, startLocation.lng),
        destination: new google.maps.LatLng(endLocation.lat, endLocation.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => resolve(status === "OK")
    );
  });

  if (!isDriveable) {
    throw new Error("This route is not accessible by car");
  }

  const pickUpAddress = await reverseGeocode(
    startLocation.lat,
    startLocation.lng
  );
  const destination = await reverseGeocode(endLocation.lat, endLocation.lng);

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
    const response = await fetch(`${BASE_URL}locations/`, {
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
