import Cookies from "js-cookie";
import { getStartCoordinates, getEndCoordinates } from "../maps/RouteMap";
import { getCurrentUser } from "../api/GetUserInfo";

// LocationData 인터페이스 수정
interface LocationData {
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  address?: string;
  first_name: string;
  last_name: string;
}

export const sendLocationToBackend = async (): Promise<void> => {
  try {
    const user = await getCurrentUser();
    console.log("User data:", user);

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
      first_name: user.first_name, // 이름 저장
      last_name: user.last_name, // 성 저장
    };

    console.log("Sending location data:", locationData);

    const response = await fetch("http://127.0.0.1:8000/api/v1/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include",
      body: JSON.stringify(locationData),
    });

    const responseData = await response.json();
    console.log("Server response:", responseData);

    if (!response.ok) {
      throw new Error("Failed to save location data");
    }

    console.log("Location saved successfully");
  } catch (error) {
    console.error("Error saving location:", error);
    throw error;
  }
};
