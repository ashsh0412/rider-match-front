import { CoordinatesForRouteMap, RouteOptions } from "../type";

export function calcRoute({
  start,
  end,
  directionsService,
  directionsRenderer,
}: RouteOptions): Promise<CoordinatesForRouteMap> {
  return new Promise((resolve, reject) => {
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK" && result) {
        directionsRenderer.setDirections(result);

        const startLocation = result.routes[0].legs[0].start_location;
        const endLocation = result.routes[0].legs[0].end_location;

        const coordinates = {
          start: {
            lat: startLocation.lat(),
            lng: startLocation.lng(),
          },
          end: {
            lat: endLocation.lat(),
            lng: endLocation.lng(),
          },
        };

        // 시작 위치와 도착 위치를 따로 저장
        localStorage.setItem(
          "startCoordinates",
          JSON.stringify(coordinates.start)
        );
        localStorage.setItem("endCoordinates", JSON.stringify(coordinates.end));

        resolve(coordinates);
      } else {
        console.log("error");
      }
    });
  });
}

// 시작 위치 가져오기
export function getStartCoordinates() {
  const stored = localStorage.getItem("startCoordinates");
  return stored ? JSON.parse(stored) : null;
}

// 도착 위치 가져오기
export function getEndCoordinates() {
  const stored = localStorage.getItem("endCoordinates");
  return stored ? JSON.parse(stored) : null;
}
