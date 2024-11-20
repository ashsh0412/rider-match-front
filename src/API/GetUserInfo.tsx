// api.ts
import Cookies from "js-cookie";
import { BASE_URL, UserData } from "../type";

export const getCurrentUser = async (): Promise<UserData> => {
  try {
    const response = await fetch(`${BASE_URL}users/me`, {
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

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
