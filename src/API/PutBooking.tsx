import Cookies from "js-cookie";

// updateBookingPassengers.ts
export async function updateBookingPassengers(
  bookingId: number,
  newPassengerIds: number[] // 여러 승객의 ID를 배열로 받음
) {
  try {
    // 새로운 passengers 배열 생성
    const passengers = newPassengerIds.map((id) => ({
      id: id,
    }));

    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/bookings/my-bookings/${bookingId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        credentials: "include",
        body: JSON.stringify({ passengers: passengers }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update passenger IDs");
    }
    console.log("Passenger IDs updated successfully");
  } catch (error) {
    console.error("Error updating passenger IDs:", error);
    throw error;
  }
}
