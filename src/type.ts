import { ToastId, UseToastOptions } from "@chakra-ui/react";

export interface DeleteAccountProps {
  id: string;
}

// API 응답을 위한 인터페이스
export interface LocationResponse {
  user: number;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_rider: boolean;
  is_driver: boolean;
}

export interface LoginCheckProps {
  children: React.ReactNode;
}

// BookingData 인터페이스
export interface BookingData {
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

export interface UpdateProfileProps {
  formData: Record<string, any>;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  toast: (options: UseToastOptions) => ToastId;
}

export interface CustomDatePickerProps {
  onChange: (date: Date | null) => void;
  iconColor: string;
  inputBg: string;
  inputHoverBg: string;
  value: Date | null;
}

export interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface Passenger {
  id: number;
  name: string;
  pickup: string;
  destination: string;
  time: string;
}

export interface PassengerCardProps {
  passenger: Passenger;
  isSelected: boolean;
  onClick: (id: number) => void;
}

export interface RideRequestFormProps {
  onSuccess: () => void;
}

export interface SuccessMessageProps {
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setOptRoute?: React.Dispatch<React.SetStateAction<boolean>>; // 필수 prop
}

export interface PassengerDetail {
  id: number;
  name: string;
  pickup: string;
  destination: string;
  time: string;
}

export interface PassengerDetailForRouteData {
  name: string;
  pickup: string;
  time: string;
}

// RouteMap 컴포넌트의 props 인터페이스
export interface RouteMapProps {
  passengerDetails: PassengerDetail[];
}

// 픽업 시간 정보를 위한 인터페이스
export interface PickupTime {
  location: string; // 픽업 위치
  time: string; // 픽업 시간
}

// 경유지 정보를 위한 인터페이스
export interface Waypoint {
  location: string; // 경유지 위치
  stopover: boolean; // 경유지 정차 여부
}

// BookingData 인터페이스 정의
export interface BookingData {
  rider: number;
  driver_name: string;
  pickup_times: string[];
  locations: {
    pickups: string[];
    destinations: string[];
  };
  guests: number;
  created_at: string;
  arrival_time: string;
  starting_point: string;
  passengers: { id: number; name: string }[];
}

// 경로 계산을 위한 props 인터페이스
export interface UseRouteCalculationProps {
  locationData: LocationDataForOptRoute;
  passengerDetails: PassengerDetail[];
  calculatePickupTimes: (legs: google.maps.DirectionsLeg[]) => PickupTime[];
}

export interface RouteMapRendererProps {
  locationData: LocationDataForOptRoute;
  calculatePickupTimes: (legs: google.maps.DirectionsLeg[]) => PickupTime[];
  passengerDetails: PassengerDetail[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  first_name: string;
  last_name: string;
  user: number;
  date_time: string;
  pickup_location: string;
  dropoff_location: string;
  id?: number;
}

// 위치 데이터를 위한 인터페이스
export interface LocationDataForOptRoute {
  origin: string; // 출발지
  destination: string; // 최종 목적지
  waypoints: Waypoint[]; // 경유지 목록
  labels: {
    origin: string; // 출발지 라벨
    destination: string; // 목적지 라벨
    passengers: {
      // 승객 정보
      name: string;
      scheduledTime: string;
      pickup: string;
    }[];
  };
}

export interface LocationDataForRouteRender {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  waypoints: { location: string }[];
}

export interface LocationDataForRouteData {
  origin: string;
  destination: string;
  waypoints: {
    location: string;
    stopover: boolean;
  }[];
  labels: {
    origin: string;
    destination: string;
    passengers: {
      name: string;
      scheduledTime: string;
      pickup: string;
    }[];
  };
}

export interface RouteOptions {
  start: string;
  end: string;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
}

export interface CoordinatesForRouteMap {
  start: {
    lat: number;
    lng: number;
  };
  end: {
    lat: number;
    lng: number;
  };
}

export interface PickupTime {
  location: string;
  time: string;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  is_rider: boolean;
  username: string;
}

export interface Guest {
  id: number;
  name: string;
}

export interface PickupWithTime {
  location: string;
  time: string;
  type: "pickup";
}

export interface Location {
  name: string;
  type: "pickup" | "waypoint" | "dropoff";
  pickupTime?: string;
}

export interface Trip {
  id: number;
  date: string;
  startingPoint: string;
  pickupTime: string;
  arrivalTime: string;
  locations: Location[];
  guests: { id: number; name: string }[];
  driverName: string;
  status: "Completed" | "Pending";
}

export interface LocationCard {
  id: number;
  user: number;
  pickupLocation: string;
  dropoffLocation: string;
  dateTime: string;
}

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api/v1/"
    : "https://drivermatch.store/";

export const KAKAO_REDIRECT_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000/oauth/kakao"
    : "https://rider-match-front.onrender.com/oauth/kakao";
