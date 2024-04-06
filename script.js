const apiKey = 'ac8ebda60126508684883d98549fcdee';

// Function to fetch current weather data
function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            // Set dynamic background based on weather condition
            document.body.setAttribute('data-weather', data.weather[0].main);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('weather').innerHTML = '<p>Error fetching weather data</p>';
        });
}

// Function to display current weather data
function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = `
        <div class="weather-item">
            <p>City: ${data.name}</p>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Description: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
}

// Function to fetch 5-day weather forecast
function fetchWeatherForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(displayForecast)
        .catch(error => console.error('Error fetching forecast:', error));
}

// Function to display 5-day weather forecast
function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { // Every 3 hours * 8 = 24 hours
            const date = new Date(forecast.dt * 1000);
            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <p>${date.toDateString()}</p>
                    <p>Temp: ${forecast.main.temp}°C</p>
                    <p>Description: ${forecast.weather[0].description}</p>
                </div>
            `;
        }
    });
}

// Function to fetch air quality data
function fetchAirQuality(lat, lon) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(displayAirQuality)
        .catch(error => console.error('Error fetching air quality:', error));
}

// Function to display air quality data
function displayAirQuality(data) {
    const airQualityDiv = document.getElementById('air-quality');
    const aqi = data.list[0].main.aqi;
    airQualityDiv.innerHTML = `<p>Air Quality Index: ${aqi}</p>`;
}
document.getElementById('cityInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const city = document.getElementById('cityInput').value;
        fetchWeather(city);
        fetchWeatherForecast(city);
    }
});


// Event listener for the 'Fetch Weather' button
document.getElementById('fetchWeatherButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
    fetchWeatherForecast(city);
});

// Event listener for the 'Use Current Location' button
document.getElementById('fetchLocationWeatherButton').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude: lat, longitude: lon } = position.coords;
        fetchWeatherByCoords(lat, lon);
        fetchAirQuality(lat, lon);
    }, error => {
        console.error('Error getting location:', error);
        alert('Error getting location. Please enter a city name manually.');
    });
});

// Function to fetch weather by geographic coordinates
function fetchWeatherByCoords(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            // Set dynamic background based on weather condition
            document.body.setAttribute('data-weather', data.weather[0].main);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('weather').innerHTML = '<p>Error fetching weather data</p>';
        });
}
