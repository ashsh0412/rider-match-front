import React, { useEffect, useRef } from "react";
import { coolUrbanMapStyles, darkMapStyles } from "./MapStyle";
import { useColorMode, useToast } from "@chakra-ui/react";
import { initializeAutocomplete } from "./AutoComplete";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const map = useRef<google.maps.Map | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

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

  const handleLocationError = (
    browserHasGeolocation: boolean,
    map: google.maps.Map | null
  ) => {
    showToast(
      "Location Error",
      browserHasGeolocation
        ? "The Geolocation service failed."
        : "Your browser doesn't support geolocation.",
      "error"
    );
    map?.setCenter({ lat: 29.652, lng: -82.325 }); // 기본 위치로 센터 이동
  };

  useEffect(() => {
    const match = document.cookie.match(
      new RegExp("(^| )locationData=([^;]+)")
    );

    directionsService.current = new google.maps.DirectionsService();
    directionsRenderer.current = new google.maps.DirectionsRenderer();

    let locationData: { pickup: string; dropoff: string } | null = null;
    if (match) {
      locationData = JSON.parse(decodeURIComponent(match[2]));
      console.log(locationData);
    } else {
      console.log("Location data not found");
    }

    const initMap = async (): Promise<void> => {
      try {
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;

        const mapStyles =
          colorMode === "dark" ? darkMapStyles : coolUrbanMapStyles;

        if (mapRef.current && !map.current) {
          map.current = new Map(mapRef.current, {
            center: { lat: 29.652, lng: -82.325 },
            zoom: 15,
            clickableIcons: false,
            disableDefaultUI: true,
            styles: mapStyles,
          });

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                map.current?.setCenter(pos);
              },
              () => {
                handleLocationError(true, map.current);
              }
            );
          } else {
            handleLocationError(false, map.current);
          }

          if (directionsRenderer.current) {
            directionsRenderer.current.setMap(map.current);
          }

          const pickupInput = document.getElementById(
            "pickup-location"
          ) as HTMLInputElement;
          const dropoffInput = document.getElementById(
            "dropoff-location"
          ) as HTMLInputElement;

          if (pickupInput) {
            initializeAutocomplete(
              pickupInput,
              "pickup",
              map.current,
              directionsService.current,
              directionsRenderer.current,
              showToast
            );
          }

          if (dropoffInput) {
            initializeAutocomplete(
              dropoffInput,
              "dropoff",
              map.current,
              directionsService.current,
              directionsRenderer.current,
              showToast
            );
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
    }

    return () => {
      if (mapRef.current) {
        google.maps.event.clearListeners(mapRef.current, "bounds_changed");
      }
    };
  }, [colorMode, toast]);

  // colorMode가 변경될 때 지도 스타일 업데이트
  useEffect(() => {
    if (map.current) {
      const mapStyles =
        colorMode === "dark" ? darkMapStyles : coolUrbanMapStyles;
      map.current.setOptions({ styles: mapStyles });
    }
  }, [colorMode]);

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
