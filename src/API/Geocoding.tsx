export const reverseGeocode = (
  latitude: number,
  longitude: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder(); // 내부에서 geocoder 생성
    const latlng = { lat: latitude, lng: longitude };

    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          resolve(response.results[0].formatted_address);
        } else {
          console.error("No results found");
          resolve("");
        }
      })
      .catch((error) => {
        console.error("Geocoder failed:", error);
        reject(error);
      });
  });
};
