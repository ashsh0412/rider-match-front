import Cookies from "js-cookie";

interface BookingData {
  rider: number;
  driver_name: string;
  passengers: Array<{
    id: number;
    name: string;
  }>;
  pickup_times: string[];
  locations: {
    pickups: string[];
    destinations: string[];
  };
  guests: number;
  created_at: string;
}

// PostBooking 함수 시그니처 수정
export const getBooking = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/bookings/my-bookings/",
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
      throw new Error(`Booking failed: ${await response.text()}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error creating booking:", e);
    return null;
  }
};
