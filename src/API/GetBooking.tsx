import Cookies from "js-cookie";
import { BASE_URL } from "../type";

// PostBooking 함수 시그니처 수정
export const getBooking = async () => {
  try {
    const response = await fetch(`${BASE_URL}v1/bookings/my-bookings/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Booking failed: ${await response.text()}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error creating booking:", e);
    return null;
  }
};
