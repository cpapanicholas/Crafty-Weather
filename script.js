// GLOBAL SCOPE VARIABLES
// base API URLs for OpenBreweryDB & OpenWeather
var breweryApiUrl = "https://api.openbrewerydb.org/v1/breweries/";
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var weatherApiKey = ""; // add key here for testing

var searchCity = ""; // city being searched, updated upon searchByCity()

// element variables
// need variables for: search box div, input & button; weather box div


// FUNCTIONS
function init() {
    // this initial function will set up the page with a blank search result box and blank weather box
}

function renderWeather() {
    // this function will render the weather on the right section
}

function searchByCity() {
    // this function will take the user input and attempt to search by city in OpenBreweryDB
    // if the city is invalid, it will inform the user in some way (TBD, just not using alert and stuff)
    // if it is valid, a list of breweries will be shown and the weather section will be updated using renderWeather()
    // set searchCity to the userinput for clarity
}

// eventlisteners
// eventlistener for search button, call searchByCity()