// src/api/maps.ts
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface MapsConfigResponse {
  apiKey: string;
}

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken") || "",
  },
});

// Google Maps API 키 가져오기
export const getMapsConfig = async (): Promise<string> => {
  try {
    const response = await api.get<MapsConfigResponse>("/maps/config/");
    return response.data.apiKey;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to load Maps API key"
      );
    }
    throw error;
  }
};
