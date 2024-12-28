export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "YourAppName", // 사용자 에이전트 설정
        "Accept-Language": "en",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data from Nominatim API");
      }
      return response.json();
    })
    .then((data) => data?.display_name || "")
    .catch((err) => {
      console.error("Error during reverse geocoding:", err);
      return ""; // 에러 발생 시 빈 문자열 반환
    });
};

export const geocode = (
  address: string,
  callback: (result: string) => void
) => {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
      const { lat, lng } = results[0].geometry.location;
      callback(`${lat()},${lng()}`);
    } else {
      console.log("geocode failed", status);
      callback("");
    }
  });
};
