let currentTime = new Date();

function formatDate() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Data on day, hour and minute
  let currentDay = days[currentTime.getDay()];
  let currentHour = currentTime.getHours();
  let currentMinute = currentTime.getMinutes();

  // added a 0 if time was under 10
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }

  let todayTime = `${currentDay}, ${currentHour}:${currentMinute}`;

  return todayTime;
}

function formatFutureDay(timestamp) {
  // Need to multiply time by 1000 (JS used milliseconds to represent epoch time, 1000 milliseconds in one second)
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class = "weather-forecast-date">${formatFutureDay(
          forecastDay.dt
        )}</div>
        <img src = "http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt = "" width = 40px />
        <div class = "weather-forecast-temperatures">
            <span class = "weather-forecast-temperature-min">${Math.round(
              forecastDay.temp.min
            )}°C</span> 
            <span class = "weather-forecast-temperature-max">${Math.round(
              forecastDay.temp.max
            )}°C</span>
        </div>
        </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let todayTime = document.querySelector("#todaysTime");
todayTime.innerHTML = formatDate();

function searchCity(city) {
  // documentation: `https://api.openweathermap.org/data/2.5/weather?q=city&appid=apiKey&units=units`
  let apiKey = "2fe015e63630ed57d2ca7047e4ab4479";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}

function getForecast(coordinates) {
  let apiKey = "2fe015e63630ed57d2ca7047e4ab4479";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#todayTemperature");
  temperatureElement.innerHTML = temperature;

  let city = response.data.name;
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = city;

  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = humidity;

  let wind = Math.round(response.data.wind.speed);
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = wind;

  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = description;

  let icon = response.data.weather[0].icon;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconElement.setAttribute("alt", description);

  celsiusTemperature = temperature;

  getForecast(response.data.coord);
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "2fe015e63630ed57d2ca7047e4ab4479";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchBar = document.querySelector("#search-form");
searchBar.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#currentLocation");
currentButton.addEventListener("click", getLocation);

let celsiusTemperature = null;

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#todayTemperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

searchCity("Sydney");
