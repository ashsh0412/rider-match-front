// api.ts
import Cookies from "js-cookie";

export interface LocationData {
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  address?: string;
  first_name: string;
  last_name: string;
  user: number; // 사용자 ID 추가
}

export const getLocations = async (): Promise<LocationData> => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/locations/get/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const locationrData = await response.json();
    return locationrData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
