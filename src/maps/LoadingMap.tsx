import React, { useEffect, useRef } from "react";
import { coolUrbanMapStyles, darkMapStyles } from "./MapStyle"; // 일반 스타일 임포트
import { useColorMode } from "@chakra-ui/react"; // 다크 모드 사용을 위해 Chakra UI의 useColorMode 훅 추가

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode(); // colorMode를 가져옵니다.

  useEffect(() => {
    const initMap = async (): Promise<void> => {
      try {
        // Google Maps와 Places 라이브러리 로드
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { Autocomplete } = (await google.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;

        // 지도 스타일 설정 (다크 모드에 따라 다르게 설정)
        const mapStyles =
          colorMode === "dark" ? darkMapStyles : coolUrbanMapStyles; // 기본 스타일

        // 지도 초기화
        if (mapRef.current) {
          const map = new Map(mapRef.current, {
            center: { lat: 29.652, lng: -82.325 }, // 서울 중심 좌표
            zoom: 15,
            styles: mapStyles, // 스타일 적용
            clickableIcons: false, // 클릭 가능한 아이콘 비활성화
            disableDefaultUI: true, // 기본 UI 비활성화
          });

          // Autocomplete 초기화 및 미국으로 제한
          const pickupInput = document.getElementById(
            "pickup-location"
          ) as HTMLInputElement;
          const dropoffInput = document.getElementById(
            "dropoff-location"
          ) as HTMLInputElement;

          if (pickupInput) {
            const autocompletePickup = new Autocomplete(pickupInput, {
              fields: ["formatted_address", "name"],
              types: ["geocode"],
              componentRestrictions: { country: ["us"] },
            });

            autocompletePickup.addListener("place_changed", () => {
              const place = autocompletePickup.getPlace();
              if (!place.geometry || !place.geometry.location) {
                console.log("선택된 장소에 대한 정보가 없습니다.");
                return;
              }
              console.log("선택된 장소:", place.name);
              map.setCenter(place.geometry.location);
              map.setZoom(17);
              new google.maps.Marker({
                position: place.geometry.location,
                map,
              });
            });
          }

          if (dropoffInput) {
            const autocompleteDropoff = new Autocomplete(dropoffInput, {
              fields: ["formatted_address", "name"],
              types: ["geocode"],
              componentRestrictions: { country: ["us"] },
            });

            autocompleteDropoff.addListener("place_changed", () => {
              const place = autocompleteDropoff.getPlace();
              if (!place.geometry || !place.geometry.location) {
                console.log("선택된 장소에 대한 정보가 없습니다.");
                return;
              }
              console.log("선택된 장소:", place.name);
              map.setCenter(place.geometry.location);
              map.setZoom(17);
              new google.maps.Marker({
                position: place.geometry.location,
                map,
              });
            });
          }
        }
      } catch (error) {
        console.error("Error initializing map: ", error);
      }
    };

    if (window.google) {
      initMap();
    } else {
      console.error("Google Maps API not loaded");
    }
  }, [colorMode]); // colorMode가 변경될 때마다 지도 초기화

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%", // height를 100vh로 고정
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
