import { useEffect, useRef, useState } from "react";
import { useColorMode } from "@chakra-ui/react";
import { darkMapStylesForOpt, coolUrbanMapStylesForOpt } from "./MapStyle";
import { Coordinates, LocationDataForRouteRender, Passenger } from "../type";
import { geocode } from "../API/Geocoding";

export const OptMapRenderer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] =
    useState<LocationDataForRouteRender | null>(null);
  const { colorMode } = useColorMode();

  // 숫자 마커 스타일 생성 함수
  const createNumberMarker = (number: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    if (context) {
      // 원 그리기
      context.beginPath();
      context.arc(16, 16, 14, 0, 2 * Math.PI);
      // 다크모드일 때는 좀 더 어두운 파란색 사용
      context.fillStyle = colorMode === "dark" ? "#1a73e8" : "#4285F4";
      context.fill();

      // 테두리
      context.strokeStyle = colorMode === "dark" ? "#333333" : "#FFFFFF";
      context.lineWidth = 2;
      context.stroke();

      // 숫자 텍스트
      context.font = "bold 14px Arial";
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(number.toString(), 16, 16);
    }

    return canvas.toDataURL();
  };

  useEffect(() => {
    const startCoordinatesStr = localStorage.getItem("startCoordinates");
    const endCoordinatesStr = localStorage.getItem("endCoordinates");
    const savedDetailsStr = localStorage.getItem("selectedPassengerDetails");

    if (startCoordinatesStr && endCoordinatesStr && savedDetailsStr) {
      const startCoordinates: Coordinates = JSON.parse(startCoordinatesStr);
      const endCoordinates: Coordinates = JSON.parse(endCoordinatesStr);
      const passengers: Passenger[] = JSON.parse(savedDetailsStr);

      const origin = {
        lat: startCoordinates.lat,
        lng: startCoordinates.lng,
      };

      const destination = {
        lat: endCoordinates.lat,
        lng: endCoordinates.lng,
      };

      const waypoints = passengers.map((p) => ({
        location: p.pickup,
      }));

      setLocationData({ origin, destination, waypoints });
    }
  }, []);

  useEffect(() => {
    if (!locationData?.origin || !locationData?.destination) return;

    const initializeMap = () => {
      const mapElement = mapRef.current;

      if (!mapElement) {
        setError("지도 컨테이너를 찾을 수 없습니다");
        return false;
      }

      mapInstanceRef.current = new google.maps.Map(mapElement, {
        zoom: 13,
        center: locationData.origin,
        styles:
          colorMode === "dark" ? darkMapStylesForOpt : coolUrbanMapStylesForOpt,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // 기존 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      return true;
    };

    const calculateRoute = async () => {
      if (!initializeMap()) return;

      const directionsService = new google.maps.DirectionsService();
      const request: google.maps.DirectionsRequest = {
        origin: locationData.origin,
        destination: locationData.destination,
        optimizeWaypoints: true,
        waypoints: locationData.waypoints.map((wp) => ({
          location: wp.location,
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      };

      try {
        const result = await new Promise<google.maps.DirectionsResult | null>(
          (resolve, reject) => {
            directionsService.route(request, (response, status) => {
              if (status === google.maps.DirectionsStatus.OK && response) {
                resolve(response);
              } else {
                reject(status);
              }
            });
          }
        );

        if (result && mapInstanceRef.current) {
          const renderer = new google.maps.DirectionsRenderer({
            map: mapInstanceRef.current,
            directions: result,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: colorMode === "dark" ? "#4285F4" : "#4285F4",
              strokeWeight: 4,
            },
          });

          // 최적화된 경로 순서 가져오기
          const waypointOrder = result.routes[0].waypoint_order;

          // Google Maps 링크 생성
          const origin = `${locationData.origin.lat},${locationData.origin.lng}`;
          const destination = `${locationData.destination.lat},${locationData.destination.lng}`;
          let completedGeocodes = 0;
          const waypointCoords: string[] = new Array(
            locationData.waypoints.length
          );

          // 최적화된 순서로 waypoint 처리
          locationData.waypoints.forEach((wp, index) => {
            geocode(wp.location, (geocodeResult) => {
              // waypointOrder를 사용하여 올바른 순서로 저장
              const optimizedIndex = waypointOrder[index];
              waypointCoords[optimizedIndex] = geocodeResult;
              completedGeocodes++;

              // 모든 waypoint가 처리되었을 때
              // 모든 waypoint가 처리되었을 때
              if (completedGeocodes === locationData.waypoints.length) {
                // 모든 좌표가 유효한지 확인
                const allCoordsValid = waypointCoords.every(
                  (coord) => coord != null
                );

                if (allCoordsValid) {
                  const waypointsString = waypointCoords.join("|");

                  sessionStorage.setItem(
                    "googleMapLink",
                    `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypointsString}&travelmode=driving&optimize=true`
                  );
                } else {
                  console.error("Some waypoints failed to geocode");
                }
              }
            });
          });

          // 경유지 마커 생성
          result.routes[0].legs.forEach((leg, index) => {
            const marker = new google.maps.Marker({
              position: leg.start_location,
              map: mapInstanceRef.current!,
              icon: {
                url: createNumberMarker(index + 1),
                scaledSize: new google.maps.Size(32, 32),
              },
            });
            markersRef.current.push(marker);
          });

          // 목적지 마커
          const destinationMarker = new google.maps.Marker({
            position:
              result.routes[0].legs[result.routes[0].legs.length - 1]
                .end_location,
            map: mapInstanceRef.current,
            icon: {
              url: createNumberMarker(result.routes[0].legs.length + 1),
              scaledSize: new google.maps.Size(32, 32),
            },
          });
          markersRef.current.push(destinationMarker);

          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs.forEach((leg) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          mapInstanceRef.current.fitBounds(bounds);
        }
      } catch (err) {
        setError("경로 계산 실패");
      }
    };

    calculateRoute();

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, [locationData, colorMode]); // colorMode 의존성 추가

  return (
    <div ref={mapRef} style={mapContainerStyle}>
      {error && <p>{error}</p>}
    </div>
  );
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
};

export default OptMapRenderer;
