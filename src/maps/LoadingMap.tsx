import React, { useEffect, useRef } from "react";
import { coolUrbanMapStyles, darkMapStyles } from "./MapStyle";
import { useColorMode, useToast } from "@chakra-ui/react";
import { initializeAutocomplete } from "./AutoComplete";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const toast = useToast();
  let map: google.maps.Map | null = null;
  let directionsService: google.maps.DirectionsService | null = null;
  let directionsRenderer: google.maps.DirectionsRenderer | null = null;

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
    const match = document.cookie.match(
      new RegExp("(^| )locationData=([^;]+)")
    );
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    interface LocationData {
      pickup: string;
      dropoff: string;
    }
    let locationData: LocationData | null = null;
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

        if (mapRef.current && !map) {
          map = new Map(mapRef.current, {
            center: { lat: 29.652, lng: -82.325 },
            zoom: 15,
            clickableIcons: false,
            disableDefaultUI: true,
            styles: mapStyles,
          });

          directionsService = new google.maps.DirectionsService();
          directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);

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
              map,
              directionsService,
              directionsRenderer,
              showToast
            );
          }

          if (dropoffInput) {
            initializeAutocomplete(
              dropoffInput,
              "dropoff",
              map,
              directionsService,
              directionsRenderer,
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
