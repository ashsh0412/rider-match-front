export interface RouteOptions {
  start: string;
  end: string;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  onRouteCalculated?: (locations: {
    start: {
      lat: number;
      lng: number;
    };
    end: {
      lat: number;
      lng: number;
    };
  }) => void; // 콜백 함수 추가
}

export function calcRoute({
  start,
  end,
  directionsService,
  directionsRenderer,
  onRouteCalculated,
}: RouteOptions) {
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === "OK" && result) {
      directionsRenderer.setDirections(result);

      // 출발지와 도착지의 위도/경도 추출
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

      // 콜백 함수가 제공된 경우 호출
      if (onRouteCalculated) {
        onRouteCalculated(coordinates);
      }

      // 콘솔에 출력 (선택사항)
      console.log("Route coordinates:", coordinates);
    } else {
      console.error("Error fetching directions:", status);
    }
  });
}
