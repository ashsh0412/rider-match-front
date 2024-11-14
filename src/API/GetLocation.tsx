import Cookies from "js-cookie";

// api.ts
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
  id: number;
}

export const getLocations = async (): Promise<LocationData[]> => {
  // 배열 타입으로 변경
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

    const locationData = await response.json();
    return locationData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
