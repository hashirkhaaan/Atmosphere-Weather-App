const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const errorBanner = document.getElementById("errorBanner");
const errorText = document.getElementById("errorText");
const loadingSpinner = document.getElementById("loadingSpinner");
const weatherContent = document.getElementById("weatherContent");

const weatherIcon = document.getElementById("weatherIcon");
const tempDisplay = document.getElementById("tempDisplay");
const conditionText = document.getElementById("conditionText");
const cityNameDisplay = document.getElementById("cityNameDisplay");
const humidityValue = document.getElementById("humidityValue");
const windSpeedValue = document.getElementById("windSpeedValue");
const feelsLikeValue = document.getElementById("feelsLikeValue");
const pressureValue = document.getElementById("pressureValue");

const conditionIcons = {
    "Sunny": "images/clear.png",
    "Clear": "images/clear.png",
    "Partly cloudy": "images/clouds.png",
    "Cloudy": "images/clouds.png",
    "Overcast": "images/overcast.png",
    "Mist": "images/mist.png",
    "Fog": "images/mist.png",
    "Freezing fog": "images/mist.png",
    "Patchy rain possible": "images/drizzle.png",
    "Patchy drizzle": "images/drizzle.png",
    "Light drizzle": "images/drizzle.png",
    "Light rain": "images/rain.png",
    "Moderate rain": "images/rain.png",
    "Heavy rain": "images/rain.png",
    "Light snow": "images/snow.png",
    "Moderate snow": "images/snow.png",
    "Heavy snow": "images/snow.png",
    "Haze": "images/haze.png",
    "Thundery outbreaks possible": "images/rain.png"
};

const fetchWeatherData = async (city) => {
    const apiKey = "28b6e18d70b14b7aaa290027252107";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    hideError();
    showLoading(true);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error?.message || "City not found. Please try another location.";
            throw new Error(message);
        }

        const data = await response.json();
        updateUI(data);
    } catch (err) {
        showError(err.message || "Failed to fetch weather data. Please check your internet connection.");
    } finally {
        showLoading(false);
    }
};

const updateUI = (data) => {
    const { current, location } = data;
    const condition = current.condition.text;

    const iconPath = conditionIcons[condition] || "images/clouds.png";
    weatherIcon.src = iconPath;
    weatherIcon.alt = condition;

    tempDisplay.textContent = `${Math.round(current.temp_c)}°C`;
    conditionText.textContent = condition;
    cityNameDisplay.textContent = `${location.name}, ${location.country}`;
    
    humidityValue.textContent = `${current.humidity}%`;
    windSpeedValue.textContent = `${current.wind_kph} km/h`;
    feelsLikeValue.textContent = `${Math.round(current.feelslike_c)}°C`;
    pressureValue.textContent = `${current.pressure_mb} hPa`;

    weatherContent.style.display = "flex";
};

const showError = (message) => {
    errorText.textContent = message;
    errorBanner.classList.add("show");
    weatherContent.style.display = "none";
};

const hideError = () => {
    errorBanner.classList.remove("show");
};

const showLoading = (isLoading) => {
    if (isLoading) {
        loadingSpinner.classList.add("show");
        weatherContent.style.display = "none";
    } else {
        loadingSpinner.classList.remove("show");
    }
};

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
        showError("Please enter a city name.");
        return;
    }
    fetchWeatherData(query);
});

document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData("London");
});
