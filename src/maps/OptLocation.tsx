import { getEndCoordinates } from "./RouteMap";
import { LocationData } from "../type";
import { getLocations } from "../API/GetLocation";

export const optLocations = async (): Promise<LocationData[]> => {
  try {
    const locations: LocationData[] = await getLocations(); // LocationData[] 타입 명시
    const destination = getEndCoordinates();

    const THRESHOLD = 0.0001;

    if (!locations || locations.length === 0) {
      console.log("라이더 정보가 없습니다.");
      return []; // 빈 배열 반환 추가
    }

    // destination과 비슷한 좌표를 가진 위치 데이터 필터링
    const matchingLocations = locations.filter((location) => {
      const latitudeDiff = Math.abs(location.end_latitude - destination.lat);
      const longitudeDiff = Math.abs(location.end_longitude - destination.lng);

      return latitudeDiff <= THRESHOLD && longitudeDiff <= THRESHOLD;
    });

    if (matchingLocations.length > 0) {
      return matchingLocations;
    } else {
      throw new Error("근처에 일치하는 위치 데이터가 없습니다.");
    }
  } catch (error) {
    console.log("Error finding location:", error);
    return []; // 빈 배열 반환 추가
  }
};
