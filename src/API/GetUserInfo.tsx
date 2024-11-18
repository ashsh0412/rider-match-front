// api.ts
import Cookies from "js-cookie";
import { UserData } from "../type";

export const getCurrentUser = async (): Promise<UserData> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
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
