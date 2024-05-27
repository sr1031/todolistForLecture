import {apiKey} from "./apiKey.js";

let w = undefined;
const weatherBackground = document.body;

const askImage = (weatherStatus) => {
    const hazeImages = ["Mist", "Dust", "Smoke", "Sand", "Ash", "Haze"];
    const darkCloudImages = ["Squall", "Tornado"];

    console.log(weatherStatus);

    if (hazeImages.indexOf(weatherStatus) !== -1)
        weatherBackground.style.backgroundImage = "url('../image/Haze.jpg')";
    else if (darkCloudImages.indexOf(weatherStatus) !== -1)
        weatherBackground.style.backgroundImage =
            "url('../image/Thunderstorm.jpg')";
    else
        weatherBackground.style.backgroundImage = `url('../image/${weatherStatus}.jpg')`;
};

const askWeather = async function (location) {
    const weatherInfo = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`
    )
        .then((weather) => {
            w = weather.json();
            return w;
        })
        .then((jsonObj) => {
            w = jsonObj;
            return w;
        });

    askImage(weatherInfo.weather[0].main);
};

const askLocation = function () {
    navigator.geolocation.getCurrentPosition((loc) => {
        const location = {
            lon: loc.coords.longitude,
            lat: loc.coords.latitude,
        };

        askWeather(location);
    });
};

const askBackgroundImage = async () => {
    askLocation();
};

askBackgroundImage();