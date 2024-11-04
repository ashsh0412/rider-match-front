import Cookies from "js-cookie";

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export const sendLocationToBackend = async (
  locationData: LocationData
): Promise<void> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      throw new Error("Failed to save location data");
    }
  } catch (error) {
    console.error("Error saving location:", error);
    throw error;
  }
};
