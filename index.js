import { styles } from "./styles.js";

let map;
let autocompletePickup;
let autocompleteDropoff;
let directionsService;
let directionsRenderer;

// 지도를 그립니다. 디폴트 값은 게인즈빌입니다
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 29.651634, lng: -82.324829 },
    zoom: 13,
    disableDefaultUI: true,
    mapTypeControl: false,
  });

  const styleSelector = document.getElementById("style-selector");
  // 지도 스타일 조정
  map.setOptions({ styles: styles[styleSelector.value] });
  styleSelector.addEventListener("change", () => {
    map.setOptions({ styles: styles[styleSelector.value] });
  });

  //현재 위치를 가져온 후 지도에 마커 표시를합니다
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos); // 현재 위치 기준으로 지도 설정
        new google.maps.Marker({
          position: pos,
          map: map,
        });
      },
      function () {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, map.getCenter());
  }
}

directionsService = new google.maps.DirectionsService();
directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

function onPlaceChanged() {
  var place = this.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
    });
  }
}

window.window.calculateRoute = function () {
  const origin = document.getElementById("pickup-location").value;
  const destination = document.getElementById("dropoff-location").value;

  if (origin && destination) {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING, // 나중에 고를 수 있게 만들기
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          const route = response.routes[0];
          const estimatedTime = route.legs[0].duration.text;
          document.getElementById(
            "estimated-time"
          ).innerHTML = `Estimated travel time: ${estimatedTime}`; // 예상시간 적기
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
};

function handleLocationError(browserHasGeolocation, pos) {
  console.log(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
}

window.onload = function () {
  initMap();
  initAutocomplete();
};

// 자동 주소 완성
function initAutocomplete() {
  const pickupInput = document.getElementById("pickup-location");
  const dropoffInput = document.getElementById("dropoff-location");

  if (pickupInput.type === "text") {
    autocompletePickup = new google.maps.places.Autocomplete(pickupInput, {
      types: ["geocode"],
    });
    autocompletePickup.addListener("place_changed", onPlaceChanged);
  }

  autocompleteDropoff = new google.maps.places.Autocomplete(dropoffInput, {
    types: ["geocode"],
  });
  autocompleteDropoff.addListener("place_changed", onPlaceChanged);
}

// 사용자 선택에 따라 인풋 타입 변경 및 자동완성 활성화/비활성화
document.querySelectorAll(".ride-option").forEach((option) => {
  option.addEventListener("click", function () {
    document.querySelector(".ride-option.active").classList.remove("active");
    this.classList.add("active");

    const pickupInput = document.getElementById("pickup-location");

    if (this.textContent === "Driver") {
      pickupInput.type = "number";
      pickupInput.placeholder = "Number of passengers";
      pickupInput.value = "";
      google.maps.event.clearInstanceListeners(pickupInput); // 자동완성 해제
    } else {
      pickupInput.type = "text";
      pickupInput.placeholder = "Pickup location";
      pickupInput.value = "";
      initAutocomplete(); // 자동완성 재설정
    }
  });
});

// api key 숨기기
// 마커 누르면 사라지게
// 사라진 마커 정보 경로 검색에서 제외하기
// 경유지 추가
