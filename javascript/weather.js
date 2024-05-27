import {apiKey} from "./apiKey.js";

const weatherBackground = document.body;

const askImage = ({weather}) => {
    const [weatherTitle] = weather;
    const hazeImages = ["Mist", "Dust", "Smoke", "Sand", "Ash", "Haze"];
    const darkCloudImages = ["Squall", "Tornado"];

    console.log(weatherTitle.main);

    if (hazeImages.indexOf(weatherTitle.main) !== -1)
        weatherBackground.style.backgroundImage = "url('../image/Haze.jpg')";
    else if (darkCloudImages.indexOf(weatherTitle.main) !== -1)
        weatherBackground.style.backgroundImage =
            "url('../image/Thunderstorm.jpg')";
    else
        weatherBackground.style.backgroundImage = `url('../image/${weatherTitle.main}.jpg')`;
};

const askWeather = async function ({lat, lon}) {
    const weatherInfo = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )
        .then((weather) => {
            return weather.json();
        })
        .then((jsonObj) => {
            return jsonObj;
        });

    askImage(weatherInfo);
};

const askLocation = function () {
    navigator.geolocation.getCurrentPosition(({coords}) => {
        const {latitude, longitude} = coords;
        const location = {
            lon: longitude,
            lat: latitude,
        };

        askWeather(location);
    });
};

const askBackgroundImage = async () => {
    askLocation();
};

askBackgroundImage();