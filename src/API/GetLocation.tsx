import Cookies from "js-cookie";
import { getCurrentUser } from "./GetUserInfo";
import { BASE_URL, LocationData } from "../type";

export const getLocations = async (): Promise<LocationData[]> => {
  // 배열 타입으로 변경
  try {
    const response = await fetch(`${BASE_URL}locations/get/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include",
    });

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

export const getUserLocations = async (): Promise<LocationData[]> => {
  try {
    // 현재 사용자 정보와 모든 위치 데이터를 동시에 가져옴
    const [currentUser, allLocations] = await Promise.all([
      getCurrentUser(),
      getLocations(),
    ]);

    // 현재 사용자의 위치 데이터만 필터링
    const userLocations = allLocations.filter(
      (location) => location.user === currentUser.id
    );

    return userLocations;
  } catch (error) {
    console.error("Error fetching user locations:", error);
    throw error;
  }
};
