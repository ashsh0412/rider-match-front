import { RouteOptions } from "../type";
import { calcRoute } from "./RouteMap";

export const initializeAutocomplete = (
  inputElement: HTMLInputElement,
  autocompleteType: string,
  map: google.maps.Map | null,
  directionsService: google.maps.DirectionsService | null,
  directionsRenderer: google.maps.DirectionsRenderer | null,
  showToast: (
    title: string,
    description: string,
    status: "success" | "error"
  ) => void
) => {
  let marker: google.maps.Marker | null = null;

  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    fields: ["formatted_address", "geometry", "name"],
  });

  autocomplete.addListener("place_changed", async () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      showToast(
        "No location found",
        `The selected ${autocompleteType} place doesn't have valid location data.`,
        "error"
      );
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    // 선택한 위치를 기존 아이템 이름으로 localStorage에 저장
    if (autocompleteType === "pickup") {
      localStorage.setItem("startCoordinates", JSON.stringify({ lat, lng }));
    } else if (autocompleteType === "dropoff") {
      localStorage.setItem("endCoordinates", JSON.stringify({ lat, lng }));
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
        marker.setMap(null);
      } else {
        console.log("Please enter both fields");
      }
    }
  });
};
