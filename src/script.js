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

  let currentDay = days[currentTime.getDay()];
  let currentHour = currentTime.getHours();
  let currentMinute = currentTime.getMinutes();

  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }

  let todayTime = `${currentDay}, ${currentHour}:${currentMinute}`;

  return todayTime;
}

let todayTime = document.querySelector("#todaysTime");
todayTime.innerHTML = formatDate();

function searchCity(city) {
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

searchCity("Sydney");
