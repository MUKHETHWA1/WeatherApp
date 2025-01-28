const API_KEY = 'OQqfP8y9czSZu9b2G0gsnG233MVCUlgD'; // Replace with your AccuWeather API Key

document.getElementById('searchButton').addEventListener('click', () => {
    const location = document.getElementById('locationInput').value.trim();
    if (location) {
        getLocationKey(location);
    }
});

async function getLocationKey(location) {
    try {
        const response = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${location}`);
        const data = await response.json();
        if (data && data.length > 0) {
            const locationKey = data[0].Key;
            const locationName = `${data[0].LocalizedName}, ${data[0].AdministrativeArea.LocalizedName}`;
            get5DayForecast(locationKey, locationName);
        } else {
            showError("Location not found. Please try another search.");
        }
    } catch (error) {
        console.error(error);
        showError("An error occurred while fetching the location.");
    }
}

async function get5DayForecast(locationKey, locationName) {
    try {
        const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&metric=true`);
        const data = await response.json();
        if (data && data.DailyForecasts) {
            const forecasts = data.DailyForecasts;
            let forecastHtml = `<h2>${locationName}</h2>`;
            forecastHtml += `<div class="row">`;

            forecasts.forEach(forecast => {
                const date = new Date(forecast.Date).toDateString();
                const minTemp = forecast.Temperature.Minimum.Value;
                const maxTemp = forecast.Temperature.Maximum.Value;
                const dayWeather = forecast.Day.IconPhrase;
                const nightWeather = forecast.Night.IconPhrase;

                forecastHtml += `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${date}</h5>
                                <p class="card-text"><strong>Day:</strong> ${dayWeather}</p>
                                <p class="card-text"><strong>Night:</strong> ${nightWeather}</p>
                                <p class="card-text"><strong>Min Temp:</strong> ${minTemp}°C</p>
                                <p class="card-text"><strong>Max Temp:</strong> ${maxTemp}°C</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            forecastHtml += `</div>`;
            document.getElementById('weatherInfo').innerHTML = forecastHtml;
        } else {
            showError("Forecast data not available.");
        }
    } catch (error) {
        console.error(error);
        showError("An error occurred while fetching the forecast data.");
    }
}

function showError(message) {
    document.getElementById('weatherInfo').innerHTML = `<div class="alert alert-danger">${message}</div>`;
}
