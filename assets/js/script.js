// GLOBAL SCOPE VARIABLES
// base API URLs for OpenBreweryDB & OpenWeather
const breweryApiUrl = "https://api.openbrewerydb.org/v1/breweries";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var breweryData;
var weatherData;

const weatherApiKey = "dd00af83e89105441c591b1fdc8aa109"; // add key here for testing

var searchCity = ""; // city being searched, updated upon searchByCity()
var savedBreweries = [];

// element variables
// variables for:
// search box section & children (search input, search button, search results box)
// weather box section (all children will be generated in renderWeather())
const searchInputEl = document.querySelector("#search-input");
const searchButtonEl = document.querySelector("#search-button");
const resultsListEl = document.querySelector("#results-list");
const displayCityForecastEl = document.getElementById("display-city-forecast");
const savedListEl = document.querySelector("#saved-list"); // list in modal

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// FUNCTIONS
// this initial function will set up the page with a blank search result box and blank weather box
function init() {
    if (!localStorage.getItem("breweries")) {
        localStorage.setItem("breweries", "");
    } else {
        savedBreweries = JSON.parse(localStorage.getItem("breweries"));
    }
    // set savedBreweries to localStorage value and then render onto modal
    renderSaved();
}

// this function will take the user input and attempt to search by city in OpenBreweryDB
// if the city is invalid or has no results, it will inform the user in some way (TBD, just not using alert and stuff)
// if it is valid, a list of breweries will be shown using renderResults() and the weather section will be updated using renderWeather()
// set searchCity to the userinput for clarity
function searchByCity(event) {
    event.preventDefault(); // prevents CORS errors, somehow

    // clear brewery results
    while (resultsListEl.firstChild) {
        resultsListEl.removeChild(resultsListEl.firstChild);
    }

    searchCity = searchInputEl.value.split(' ').join('_').toLowerCase(); // replace spaces with underscores for api url

    // fetch from OpenWeather
    fetch(weatherApiUrl + "?q=" + searchCity + "&appid=" + weatherApiKey)
        .then(function (response) {
            if (response === 404) {
                // add error message to page here
                // console.log("bad input - city weather data not found");
            }
            return response.json();
        })
        .then(function (data) {
            weatherData = data;
            renderWeather(weatherData)
        });

    // fetch from OpenBreweryDB
    fetch(breweryApiUrl + "?by_city=" + searchCity + "&per_page=500")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length === 0) {
                var liEl = document.createElement("li");
                liEl.innerHTML = "There are no results for " + searchCity + ". Please check your spelling or try another city.";
                liEl.classList.add("box");
                resultsListEl.appendChild(liEl);
                // console.log("bad input - no breweries in city");
                return;
            }
            breweryData = data;
            renderResults();
        });
    renderWeather();
}

// this function will render the weather on the right section
// it will be called if searchByCity() recieves a valid city from the user's input
// this will include: today's weather on the top box and forecast on bottom box
function renderWeather(weatherData) {
    const displayCity = document.getElementById("display-city");
    const currentTemperature = document.getElementById("current-temperature");
    const weatherType = document.getElementById("weather-type");
    const riseNSet = document.getElementById("sun-up-sun-down");
    const forecastList = document.getElementById("forecast-list");
    if (weatherData) {
        // Display city name
        displayCity.textContent = `${weatherData.city.name}`;

        // Display temperature in Fahrenheit
        const tempKelvin = weatherData.list[0].main.temp;
        const tempFahrenheit = Math.round((tempKelvin - 273.15) * 9 / 5 + 32);
        currentTemperature.textContent = `Temperature: ${tempFahrenheit}°F`;

        // Display weather type
        const description = weatherData.list[0].weather.description;
        weatherType.textContent = `Weather: ${weatherData.list[0].weather[0].description}`;

        // Display sunrise and sunset times (convert UNIX timestamps to HH:mm format)
        const sunriseTimestamp = weatherData.city.sunrise * 1000;
        const sunsetTimestamp = weatherData.city.sunset * 1000;
        const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        riseNSet.textContent = `Sunrise: ${sunriseTime}, Sunset: ${sunsetTime}`;

        // Display 5-day weather forecast
        if (weatherData.list && weatherData.list.length >= 5) {
            displayCityForecastEl.textContent = weatherData.city.name
            forecastList.innerHTML = "";


            for (let i = 0; i < weatherData.list.length; i += 8) {
                const forecastItem = document.createElement("li");
                const forecastDate = weatherData.list[i].dt_txt;
                const forecastTempKelvin = weatherData.list[i].main.temp;
                const forecastTempFahrenheit = Math.round((forecastTempKelvin - 273.15) * 9 / 5 + 32);
                const forecastDescription = weatherData.list[i].weather[0].description;
                forecastItem.textContent = `${dayjs(forecastDate).format('M/D/YYYY')}: ${forecastTempFahrenheit}°F, ${forecastDescription}`;
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

// this function will render the search results in the left section search results div
function renderResults() {
    for (i = 0; i < breweryData.length; i++) {
        var liEl = document.createElement("li");
        liEl.innerHTML = "| " + breweryData[i].name + " | Type: " + breweryData[i].brewery_type + " | Phone: " + breweryData[i].phone + " | <a href=" + breweryData[i].website_url + ">Website</a> |" +
            "<button class=\"button is-small is-success\">Save</button>"; // yeah this is pretty funny but it works
        liEl.classList.add("box");
        resultsListEl.appendChild(liEl);
    }
}

// this deletes saved results from the page & localstorage
function deleteResult(event) {
    if (event.target.classList.contains("delete")) {
        // i can't explain how funny this next line is with words
        savedBreweries.splice(savedBreweries.indexOf(event.target.parentNode.innerHTML.substring(0, event.target.parentNode.innerHTML.length - 41) + " |<button class=\"button is-small is-success\">Save</button>"), 1);
        localStorage.setItem("breweries", JSON.stringify(savedBreweries));
        event.target.parentNode.remove();
    }
}

function saveResult(event) {
    if (event.target.classList.contains("button")) {
        var toSave = event.target.parentNode.innerHTML;
        if (savedBreweries.indexOf(toSave) === -1) {
            savedBreweries.push(toSave);
            localStorage.setItem("breweries", JSON.stringify(savedBreweries));
            renderSaved();
        }
    }
}

function renderSaved() {
    while (savedListEl.firstChild) {
        savedListEl.removeChild(savedListEl.firstChild);
    }

    savedBreweries.forEach(element => {
        var liEl = document.createElement("li");
        // ok, now this is like really hilarious. to remove the save button and add a delete button, i literally chop off the HTML for the save button (which i know is 58 characters) and then just add the HTML for a delete button (there is definitely a better way of doing this, but this is funny)
        liEl.innerHTML = element.substring(0, element.length - 58) + "<button class=\"delete is-small\"></button>";
        liEl.classList.add("box");
        savedListEl.appendChild(liEl);
    });
}

// eventlisteners
// eventlistener for search button, call searchByCity()
searchButtonEl.addEventListener("click", searchByCity);

// event delegation for saving and deleting results to/from localstorage
resultsListEl.addEventListener("click", saveResult);
savedListEl.addEventListener("click", deleteResult);

// evenlistener for modal functionality FROM BULMA
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            closeAllModals();
        }
    });
});

init();