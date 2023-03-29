console.log('Hello from Query script!');

// Get the query string from the URL
var queryString = window.location.search;

// Parse the query string into an object
var params = new URLSearchParams(queryString);
var searchQuery = params.get('search_query');

console.log('Search query:', searchQuery);