// mapStyles.ts
export const coolUrbanMapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }], // 전체적인 배경 색상
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }], // 물의 색상
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }], // 경관 색상
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }], // 도로의 색상
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }], // 고속도로의 색상
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }], // POI의 색상
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }], // POI 아이콘 숨기기
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }], // 대중교통 선의 색상
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }], // 대중교통 정류장 색상
  },
];
