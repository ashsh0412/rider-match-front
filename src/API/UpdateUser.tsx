// src/utils/updateProfile.ts
import Cookies from "js-cookie";
import { ToastId, UseToastOptions } from "@chakra-ui/react";

interface UpdateProfileProps {
  formData: Record<string, any>;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  toast: (options: UseToastOptions) => ToastId;
}

export const ProfileUpdate = async ({
  formData,
  setUserData,
  setIsEditing,
  toast,
}: UpdateProfileProps) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    const updatedData = await response.json();
    setUserData(updatedData);
    setIsEditing(false);

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  } catch (error) {
    toast({
      title: "Error updating profile",
      description: "Unable to update profile. Please try again later.",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  }
};
