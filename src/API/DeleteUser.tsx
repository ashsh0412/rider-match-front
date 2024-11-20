// deleteAccount.ts
import Cookies from "js-cookie";
import { UseToastOptions } from "@chakra-ui/react";
import { NavigateFunction } from "react-router-dom";
import { BASE_URL } from "../type";

interface DeleteAccountProps {
  toast: (options?: UseToastOptions) => void;
  navigate: NavigateFunction;
}

export async function DeleteAccount({ toast, navigate }: DeleteAccountProps) {
  try {
    const response = await fetch(`${BASE_URL}users/me`, {
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

    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
    navigate("/log-in");
  } catch (error) {
    toast({
      title: "Error deleting account",
      description: "Unable to delete account. Please try again later.",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  }
}
