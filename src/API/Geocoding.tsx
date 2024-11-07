export const reverseGeocode = (
  latitude: number,
  longitude: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: "application/json",
          // OpenStreetMap은 사용자 에이전트를 요구합니다
          "User-Agent": "YourAppName",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          resolve(data.display_name);
        } else {
          resolve("");
        }
      })
      .catch((err) => {
        console.error("Error during reverse geocoding:", err);
        reject(err);
      });
  });
};
