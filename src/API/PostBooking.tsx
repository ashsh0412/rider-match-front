import Cookies from "js-cookie";

// BookingData 인터페이스
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
  arrival_time: string;
  starting_point: string;
}

// PostBooking 함수 수정
export const PostBooking = async (bookingData: BookingData) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/bookings/my-bookings/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "", // CSRF token 처리
        },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify({
          rider: bookingData.rider, // 현재 로그인한 사용자 ID
          driver_name: bookingData.driver_name,
          passengers: bookingData.passengers,
          pickup_times: bookingData.pickup_times,
          locations: bookingData.locations,
          guests: bookingData.guests,
          created_at: bookingData.created_at,
          arrival_time: bookingData.arrival_time,
          starting_point: bookingData.starting_point,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Booking failed: ${errorText}`);
    }

    return await response.json(); // 응답을 JSON으로 반환
  } catch (e) {
    console.error("Error creating booking:", e);
    return null; // 에러 발생 시 null 반환
  }
};