// GLOBAL SCOPE VARIABLES
// base API URLs for OpenBreweryDB & OpenWeather
var breweryApiUrl = "https://api.openbrewerydb.org/v1/breweries";
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var breweryData;
var weatherData;

var weatherApiKey = ""; // add key here for testing

var searchCity = ""; // city being searched, updated upon searchByCity()

// element variables
// variables for:
// search box section & children (search input, search button, search results box)
// weather box section (all children will be generated in renderWeather())
var searchInputEl = document.querySelector("#search-input");
var searchButtonEl = document.querySelector("#search-button");


// FUNCTIONS
function init() {
    // this initial function will set up the page with a blank search result box and blank weather box
}

function searchByCity(event) {
    // this function will take the user input and attempt to search by city in OpenBreweryDB
    // if the city is invalid or has no results, it will inform the user in some way (TBD, just not using alert and stuff)
    // if it is valid, a list of breweries will be shown using renderResults() and the weather section will be updated using renderWeather()
    // set searchCity to the userinput for clarity
    event.preventDefault(); // prevents CORS errors, somehow

    searchCity = searchInputEl.value.split(' ').join('_').toLowerCase(); // replace spaces with underscores for api url
    console.log(searchCity);

    // fetch from OpenWeather
    fetch(weatherApiUrl + "?q=" + searchCity + "&appid=" + weatherApiKey)
        .then(function (response) {
            if (response === 404) {
                // add error message to page here
                console.log("bad input - city weather data not found");
            }
            return response.json();
        })
        .then(function (data) {
            weatherData = data;
            console.log(weatherData);
        });

    // fetch from OpenBreweryDB
    fetch(breweryApiUrl + "?by_city=" + searchCity + "&per_page=3")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length === 0) {
                // add error message to page here
                console.log("bad input - no breweries in city");
                return;
            }
            breweryData = data;
            console.log(breweryData);
        });


    // TODO: add error messages to UI/UX if user input does not return results
    // TODO: use breweryData and weatherData to render results & weather in renderWeather() and renderResults()
    renderWeather();
    renderResults();
}

    function renderWeather() {
        const displayCity = document.getElementById("display-city");
        const currentTemperature = document.getElementById("current-temperature"); 
        const weatherType = document.getElementById("weather-type");
        const riseNSet = document.getElementById("sun-up-sun-down");
        const forecastList = document.getElementById("forecast-list");

        if (weatherData) {
            // Display city name
            displayCity.textContent = `Weather in ${weatherData.name}`;
    
            // Display temperature in Fahrenheit
            const tempKelvin = weatherData.main.temp; 
            const tempFahrenheit = Math.round((tempKelvin - 273.15) * 9/5 + 32); 
            currentTemperature.textContent = `Temperature: ${tempFahrenheit}°F`; 
    
            // Display weather type
            const description = weatherData.weather[0].description;
            weatherType.textContent = `Weather: ${description}`;
    
            // Display sunrise and sunset times (convert UNIX timestamps to HH:mm format)
            const sunriseTimestamp = weatherData.sys.sunrise * 1000; 
            const sunsetTimestamp = weatherData.sys.sunset * 1000; 
            const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            riseNSet.textContent = `Sunrise: ${sunriseTime}, Sunset: ${sunsetTime}`;
    
            // Display 5-day weather forecast
            if (weatherData.list && weatherData.list.length >= 5) {
                forecastList.innerHTML = ""; 
    
                for (let i = 0; i < 5; i++) {
                    const forecastItem = document.createElement("li");
                    const forecastDate = new Date(weatherData.list[i].dt * 1000); 
                    const forecastTempKelvin = weatherData.list[i].main.temp; 
                    const forecastTempFahrenheit = Math.round((forecastTempKelvin - 273.15) * 9/5 + 32); 
                    const forecastDescription = weatherData.list[i].weather[0].description;
                    forecastItem.textContent = `${forecastDate.toLocaleDateString()}: ${forecastTempFahrenheit}°F, ${forecastDescription}`;
                    forecastList.appendChild(forecastItem);
                }
            } else {
                forecastList.textContent = "Forecast data not available.";
            }
        } else {
            // Handle case when weather data is not available
            displayCity.textContent = "Weather data not available.";
            currentTemperature.textContent = "";
            weatherType.textContent = "";
            riseNSet.textContent = "";
            forecastList.textContent = "";
        }
    }
    // this function will render the weather on the right section
    // it will be called if searchByCity() recieves a valid city from the user's input
    // this will include: today's weather on the top box and forecast on bottom box


function renderResults() {
    // this function will render the search results in the left section search results div
}

// eventlisteners
// eventlistener for search button, call searchByCity()
searchButtonEl.addEventListener("click", searchByCity);