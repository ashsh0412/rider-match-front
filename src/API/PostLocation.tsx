import Cookies from "js-cookie";
import { getStartCoordinates, getEndCoordinates } from "../maps/RouteMap";
import { getCurrentUser } from "./GetUserInfo";

// LocationData 인터페이스 수정
interface LocationData {
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  address?: string;
  first_name: string;
  last_name: string;
  user: number; // 사용자 ID 추가
  date_time?: string;
}

export const sendLocationToBackend = async (
  date_time: string
): Promise<void> => {
  try {
    const user = await getCurrentUser();
    const startLocation = getStartCoordinates();
    const endLocation = getEndCoordinates();

    if (!startLocation || !endLocation) {
      throw new Error("Location coordinates not found");
    }

    const locationData: LocationData = {
      start_latitude: startLocation.lat,
      start_longitude: startLocation.lng,
      end_latitude: endLocation.lat,
      end_longitude: endLocation.lng,
      first_name: user.first_name,
      last_name: user.last_name,
      user: user.id,
      date_time: date_time,
    };

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
    localStorage.removeItem("endCoordinates");
    localStorage.removeItem("startCoordinates");
  } catch (error) {
    console.error("Error saving location:", error);
    throw error;
  }
};
