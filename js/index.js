import { styles } from "./styles.js";
import { loadGoogleMapsAPI } from "./api.js";

let map;
let autocompletePickup;
let autocompleteDropoff;
let directionsService;
let directionsRenderer;
let markers = [];

// 토스트 생성
function showToast(message) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

// 지도를 그립니다. 디폴트 값은 게인즈빌입니다
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 29.651634, lng: -82.324829 },
    zoom: 13,
    disableDefaultUI: true,
    mapTypeControl: false,
    zoomControl: true,
    streetViewControl: true,
  });

  const styleSelector = document.getElementById("style-selector");
  // 지도 스타일 조정
  map.setOptions({ styles: styles[styleSelector.value] });
  styleSelector.addEventListener("change", () => {
    map.setOptions({ styles: styles[styleSelector.value] });
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  //현재 위치를 가져온 후 지도에 마커 표시를합니다
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos); // 현재 위치 기준으로 지도 설정
        const marker = new google.maps.Marker({
          position: pos,
          map: map,
        });
        markers.push(marker);
      },
      function () {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, map.getCenter());
  }
}

// 입력한 장소에 마커 추가하고 선택된 장소로 이동
function onPlaceChanged() {
  var place = this.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
    });
    markers.push(marker);
  }
}

// 기존 마커 제거 함수
function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // 마커를 지도에서 제거
  }
  markers = []; // 마커 배열 초기화
}

// 주소 값이 정확한지 판단
function handleLocationError(browserHasGeolocation, pos) {
  console.log(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
    pos
  );
}

// 자동 주소 완성
function initAutocomplete() {
  const pickupInput = document.getElementById("pickup-location");
  const dropoffInput = document.getElementById("dropoff-location");

  if (pickupInput.type === "text") {
    autocompletePickup = new google.maps.places.Autocomplete(pickupInput);
    autocompletePickup.setComponentRestrictions({
      country: ["us"], // 미국으로 제한
    });
    console.log(autocompletePickup);
    autocompletePickup.addListener("place_changed", onPlaceChanged);
  }

  autocompleteDropoff = new google.maps.places.Autocomplete(dropoffInput);
  autocompleteDropoff.setComponentRestrictions({
    country: ["us"], // 미국으로 제한
  });
  console.log(autocompleteDropoff);
  autocompleteDropoff.addListener("place_changed", onPlaceChanged);
}

// 사용자 선택에 따라 인풋 타입 변경 및 자동완성 활성화/비활성화
document.querySelectorAll(".ride-option").forEach((option) => {
  option.addEventListener("click", function () {
    document.querySelector(".ride-option.active").classList.remove("active");
    this.classList.add("active");

    const pickupInput = document.getElementById("pickup-location");
    const dropOffInput = document.getElementById("dropoff-location");
    const estimatedTime = document.getElementById("estimated-time");
    const estimatedBtn = document.getElementById("estimate-btn");

    if (this.textContent === "Driver") {
      pickupInput.type = "number";
      pickupInput.placeholder = "Number of passengers";
      pickupInput.value = "";
      dropOffInput.value = "";
      estimatedTime.textContent = "";
      pickupInput.min = 1;
      pickupInput.max = 5;
      estimatedBtn.style.display = "none";
      google.maps.event.clearInstanceListeners(pickupInput); // 자동완성 해제
      pickupInput.addEventListener("input", validatePassengerCount);
      initMap();
    } else {
      pickupInput.type = "text";
      pickupInput.placeholder = "Pickup location";
      pickupInput.value = "";
      dropOffInput.value = "";
      estimatedBtn.style.display = "block";
      initAutocomplete(); // 자동완성 재설정

      // 'Driver' 모드에서 추가한 input 이벤트를 제거
      pickupInput.removeEventListener("input", validatePassengerCount);
    }
  });
});

// 승객 수 검증 함수 (1에서 5 사이의 숫자만 허용)
function validatePassengerCount(event) {
  const value = event.target.value;

  const passengerCount = parseInt(value); // 입력값을 정수로 변환

  if (passengerCount < 1 || passengerCount > 5) {
    showToast("Please enter a number between 1 and 5.");
    event.target.value = ""; // 1에서 5 사이가 아니면 값을 초기화
  }
}

// 경로 시간 계산 및 경로 빌드
window.calculateRoute = function () {
  const origin = document.getElementById("pickup-location").value;
  const destination = document.getElementById("dropoff-location").value;

  if (origin && destination) {
    clearMarkers();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response); // 경로를 지도에 표시
          const route = response.routes[0];
          const estimatedTime = route.legs[0].duration.text;

          document.getElementById(
            "estimated-time"
          ).innerHTML = `Estimated Time: ${estimatedTime}`; // 예상시간 표시
        } else {
          showToast("Directions request failed due to " + status);
        }
      }
    );
  } else {
    showToast("Please enter both location and destination.");
  }
};

loadGoogleMapsAPI().then(() => {
  window.onload = function () {
    initMap();
    initAutocomplete();
  };
});
