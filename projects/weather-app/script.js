const API_KEY = '4d8fb5b93d4af21d66a2948710284366';

const weatherEmojis = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '🌫️',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Fog': '🌫️',
    'Tornado': '🌪️'
};

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;

    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const card = document.getElementById('weatherCard');

    loading.classList.add('show');
    error.classList.remove('show');
    card.classList.remove('show');

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        if (data.cod !== 200) {
            throw new Error(data.message || 'City not found');
        }

        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('weatherIcon').textContent = weatherEmojis[data.weather[0].main] || '🌡️';
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${data.wind.speed} m/s`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

        card.classList.add('show');
    } catch (err) {
        error.textContent = `❌ ${err.message}`;
        error.classList.add('show');
    } finally {
        loading.classList.remove('show');
    }
}
