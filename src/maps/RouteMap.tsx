// RouteService.ts
export interface RouteOptions {
  start: string; // 출발지
  end: string; // 도착지
  directionsService: google.maps.DirectionsService; // DirectionsService 인스턴스
  directionsRenderer: google.maps.DirectionsRenderer; // DirectionsRenderer 인스턴스
}

export function calcRoute({
  start,
  end,
  directionsService,
  directionsRenderer,
}: RouteOptions) {
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Error fetching directions:", status);
      console.log(start, end);
    }
  });
}
