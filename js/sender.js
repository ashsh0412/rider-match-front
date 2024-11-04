// Function to save location data in cookies
function saveLocationDataToCookie() {
  const pickupInput = document.getElementById("pickup-location");
  const dropoffInput = document.getElementById("dropoff-location");

  const data = JSON.stringify({
    pickup: pickupInput.value,
    dropoff: dropoffInput.value,
  });

  document.cookie = `locationData=${encodeURIComponent(
    data
  )}; path=/; max-age=86400;`; // 24 hours
}

// Add event listeners to the input fields
document
  .getElementById("pickup-location")
  .addEventListener("input", saveLocationDataToCookie);

document
  .getElementById("dropoff-location")
  .addEventListener("input", saveLocationDataToCookie);

// Function to retrieve the data from cookies
function getLocationDataFromCookie() {
  const match = document.cookie.match(new RegExp("(^| )locationData=([^;]+)"));
  if (match) {
    return JSON.parse(decodeURIComponent(match));
  }
  return null;
}
