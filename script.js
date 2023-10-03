// GLOBAL SCOPE VARIABLES
// base API URLs for OpenBreweryDB & OpenWeather
var breweryApiUrl = "https://api.openbrewerydb.org/v1/breweries";
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var breweryData;
var weatherData;

var weatherApiKey = ""; // add key here for testing DO NOT COMMIT NAKED API KEY (unless you want an email from gitprotector)

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
    fetch (weatherApiUrl + "?q=" + searchCity + "&appid=" + weatherApiKey)
        .then(function (response) {
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
            breweryData = data;
            console.log(breweryData);
        });
}

function renderWeather() {
    // this function will render the weather on the right section
    // it will be called if searchByCity() recieves a valid city from the user's input
    // this will include: today's weather on the top box and forecast on bottom box
}

function renderResults() {
    // this function will render the search results in the left section search results div
}

// eventlisteners
// eventlistener for search button, call searchByCity()
searchButtonEl.addEventListener("click", searchByCity);