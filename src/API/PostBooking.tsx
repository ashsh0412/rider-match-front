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
export const PostBooking = async (bookingData: BookingData) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/bookings/my-bookings/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        credentials: "include",
        body: JSON.stringify({
          rider: bookingData.rider, // 현재 로그인한 사용자 ID
          driver_name: bookingData.driver_name,
          passengers: bookingData.passengers,
          pickup_times: bookingData.pickup_times,
          locations: bookingData.locations,
          guests: bookingData.guests,
          created_at: bookingData.created_at,
        }),
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
