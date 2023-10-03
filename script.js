// GLOBAL SCOPE VARIABLES
// base API URLs for OpenBreweryDB & OpenWeather
var breweryApiUrl = "https://api.openbrewerydb.org/v1/breweries/";
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var weatherApiKey = ""; // add key here for testing

var searchCity = ""; // city being searched, updated upon searchByCity()

// element variables
// variables for:
// search box section & children (search input, search button, search results box)
// weather box section (all children will be generated in renderWeather())


// FUNCTIONS
function init() {
    // this initial function will set up the page with a blank search result box and blank weather box



}

function searchByCity() {


    
    // this function will take the user input and attempt to search by city in OpenBreweryDB
    // if the city is invalid or has no results, it will inform the user in some way (TBD, just not using alert and stuff)
    // if it is valid, a list of breweries will be shown using renderResults() and the weather section will be updated using renderWeather()
    // set searchCity to the userinput for clarity
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