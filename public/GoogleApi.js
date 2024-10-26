async function loadGoogleMaps() {
  try {
    const response = await fetch("http://127.0.0.1:8000/maps/config/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include",
    });
    const data = await response.json();
    const apiKey = data.apiKey;
    console.log(apiKey);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log("Google Maps loaded successfully");
    };
  } catch (error) {
    console.error("Failed to load Google Maps:", error);
  }
}

loadGoogleMaps();
