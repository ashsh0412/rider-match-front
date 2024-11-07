import { getEndCoordinates, getStartCoordinates } from "../maps/RouteMap";
import { getLocations } from "./GetLocation";

export const optLocations = async () => {
  try {
    const locations = await getLocations();
    const startLocation = getStartCoordinates();
    const destination = getEndCoordinates();

    const THRESHOLD = 0.0001;

    if (!locations || locations.length === 0) {
      console.log("라이더 정보가 없습니다.");
    }

    // destination과 비슷한 좌표를 가진 위치 데이터 필터링
    const matchingLocations = locations.filter((location) => {
      const latitudeDiff = Math.abs(location.end_latitude - destination.lat);
      const longitudeDiff = Math.abs(location.end_longitude - destination.lng);

      return latitudeDiff <= THRESHOLD && longitudeDiff <= THRESHOLD;
    });

    if (matchingLocations.length > 0) {
      console.log("가까운 위치 데이터:", matchingLocations);
      const matchedLocation = matchingLocations[0];
      console.log("최종 위도:", matchedLocation.end_latitude);
      console.log("최종 경도:", matchedLocation.end_longitude);

      return matchedLocation;
    } else {
      throw new Error("근처에 일치하는 위치 데이터가 없습니다.");
    }
  } catch (error) {
    console.error("Error finding location:", error);
    throw error; // 에러를 호출자에게 던짐
  }
};
