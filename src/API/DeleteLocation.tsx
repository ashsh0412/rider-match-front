import Cookies from "js-cookie";

interface DeleteAccountProps {
  id: string; // id 프로퍼티 추가
}

export async function deleteLocation({ id }: DeleteAccountProps) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/locations/get/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }
  } catch (error) {
    console.log(error);
  }
}
