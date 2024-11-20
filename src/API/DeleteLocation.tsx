import Cookies from "js-cookie";
import { BASE_URL, DeleteAccountProps } from "../type";

export async function deleteLocation({ id }: DeleteAccountProps) {
  try {
    const response = await fetch(`${BASE_URL}locations/get/${id}/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }
  } catch (error) {
    console.log(error);
  }
}
