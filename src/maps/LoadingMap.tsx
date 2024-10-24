import React, { useEffect, useRef } from "react";
import { coolUrbanMapStyles, darkMapStyles } from "./MapStyle";
import { useColorMode, useToast } from "@chakra-ui/react";
import { calcRoute, RouteOptions } from "./RouteMap";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const toast = useToast();
  let map: google.maps.Map | null = null;
  let directionsService: google.maps.DirectionsService | null = null;
  let directionsRenderer: google.maps.DirectionsRenderer | null = null;
  let marker: google.maps.Marker | null = null; // 마커를 저장할 변수 추가

  // toast 메시지를 표시하는 헬퍼 함수
  const showToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  useEffect(() => {
    const initMap = async (): Promise<void> => {
      try {
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { Autocomplete } = (await google.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;

        const mapStyles =
          colorMode === "dark" ? darkMapStyles : coolUrbanMapStyles;

        if (mapRef.current && !map) {
          map = new Map(mapRef.current, {
            center: { lat: 29.652, lng: -82.325 },
            zoom: 15,
            styles: mapStyles,
            clickableIcons: false,
            disableDefaultUI: true,
          });

          // DirectionsService 및 DirectionsRenderer 인스턴스 생성
          directionsService = new google.maps.DirectionsService();
          directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);

          // 자동 완성 함수
          const initializeAutocomplete = (
            inputElement: HTMLInputElement,
            autocompleteType: string
          ) => {
            const autocomplete = new Autocomplete(inputElement, {
              fields: ["formatted_address", "geometry", "name"],
              componentRestrictions: { country: ["us"] },
            });

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (!place.geometry || !place.geometry.location) {
                showToast(
                  "No location found",
                  `The selected ${autocompleteType} place doesn't have valid location data.`,
                  "error"
                );
                return;
              }

              if (map) {
                map.setCenter(place.geometry.location);
                map.setZoom(17);

                // 이전 마커를 제거
                if (marker) {
                  marker.setMap(null);
                }

                // 새로운 마커 생성
                marker = new google.maps.Marker({
                  position: place.geometry.location,
                  map,
                });

                // 두 위치가 모두 입력되었는지 확인 후 calcRoute 호출
                const pickupInput = document.getElementById(
                  "pickup-location"
                ) as HTMLInputElement;
                const dropoffInput = document.getElementById(
                  "dropoff-location"
                ) as HTMLInputElement;

                if (pickupInput.value && dropoffInput.value) {
                  const start = pickupInput.value;
                  const end = dropoffInput.value;

                  // Create RouteOptions object
                  const routeOptions: RouteOptions = {
                    start,
                    end,
                    directionsService: directionsService!,
                    directionsRenderer: directionsRenderer!,
                  };

                  // Call calcRoute function
                  calcRoute(routeOptions);
                } else {
                  console.error("픽업 또는 드랍오프 위치가 비어 있습니다");
                }
              }
            });
          };

          // 픽업 및 드랍오프 장소에 대해 함수 호출
          const pickupInput = document.getElementById(
            "pickup-location"
          ) as HTMLInputElement;
          const dropoffInput = document.getElementById(
            "dropoff-location"
          ) as HTMLInputElement;

          if (pickupInput) {
            initializeAutocomplete(pickupInput, "pickup");
          }

          if (dropoffInput) {
            initializeAutocomplete(dropoffInput, "dropoff");
          }
        }
      } catch (error) {
        console.error("Error initializing map: ", error);
        showToast(
          "Error initializing map.",
          "Failed to load Google Maps.",
          "error"
        );
      }
    };

    if (window.google) {
      initMap();
    } else {
      showToast(
        "Error initializing map.",
        "Failed to load Google Maps.",
        "error"
      );
    }

    return () => {
      if (mapRef.current) {
        google.maps.event.clearListeners(mapRef.current, "bounds_changed");
      }
    };
  }, [colorMode, toast]);

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
  };

  return (
    <div className="map-component" style={{ height: "100%" }}>
      <div ref={mapRef} style={containerStyle} className="map-container" />
    </div>
  );
};

export default MapComponent;
