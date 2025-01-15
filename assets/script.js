const apiKey = "46ad213be7910ff3f778ae802a5450f5";

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = document.getElementById("city-input").value;
    if (city) {
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        const geoData = await geoResponse.json();
        if (geoData.length > 0) {
          const { lat, lon, name } = geoData[0];
          fetchWeather(lat, lon, name);
          let cities = [];
          if (localStorage.getItem("cities") == null) {
            cities = [];
          } else {
            cities = JSON.parse(localStorage.getItem("cities"));
          }

          cities.push(name);
          localStorage.setItem("cities", JSON.stringify(cities, null, 2));

          const theCity = document.createElement("button");
          theCity.textContent = name;
          theCity.addEventListener('click', function() {
            viewcity(name);
            });
          theCity.className = "city";
          document.getElementById("cities").appendChild(theCity);
        } else {
          alert("City not found!");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  });
async function viewcity(city) {
  if (city) {
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      const geoData = await geoResponse.json();
      if (geoData.length > 0) {
        const { lat, lon, name } = geoData[0];
        fetchWeather(lat, lon, name);
      } else {
        alert("City not found!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }
}
async function fetchWeather(lat, lon, cityName) {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const weatherData = await weatherResponse.json();
    displayCurrentWeather(weatherData, cityName);
    displayForecast(weatherData.list);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

function displayCurrentWeather(data, cityName) {
  const current = data.list[0];
  const currentWeather = `
        <h3>${cityName}</h3>
        <p>Date: ${new Date(current.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${current.main.temp} °C</p>
        <p>Humidity: ${current.main.humidity}%</p>
        <p>Wind Speed: ${current.wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${
          current.weather[0].icon
        }.png" alt="${current.weather[0].description}">
    `;
  document.getElementById("current-details").innerHTML = currentWeather;
}

function displayForecast(forecast) {
  const forecastCards = forecast
    .filter((_, index) => index % 8 === 0)
    .map(
      (day) => `
        <div class="card">
            <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${
              day.weather[0].icon
            }.png" alt="${day.weather[0].description}">
            <p>Temp: ${day.main.temp} °C</p>
            <p>Humidity: ${day.main.humidity}%</p>
            <p>Wind: ${day.wind.speed} m/s</p>
        </div>
    `
    )
    .join("");
  document.getElementById("forecast-cards").innerHTML = forecastCards;
}
