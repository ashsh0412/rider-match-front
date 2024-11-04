export interface RouteOptions {
  start: string;
  end: string;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
}

export interface Coordinates {
  start: {
    lat: number;
    lng: number;
  };
  end: {
    lat: number;
    lng: number;
  };
}

export function calcRoute({
  start,
  end,
  directionsService,
  directionsRenderer,
}: RouteOptions): Promise<Coordinates> {
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

        resolve(coordinates);
      } else {
        reject(new Error(`Error fetching directions: ${status}`));
      }
    });
  });
}
