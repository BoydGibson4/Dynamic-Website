// Execute the code when the document is ready
$(document).ready(function () {
    // List of cocktail names
    const cocktailNames = ["mojito blanco", "sex on the beach", "tommy's margarita"];

    // Choose a random cocktail name from the list
    const randomCocktailName = cocktailNames[Math.floor(Math.random() * cocktailNames.length)];

    // URL for fetching cocktail details
    const cocktailUrl = `https://cocktail-by-api-ninjas.p.rapidapi.com/v1/cocktail?name=${encodeURIComponent(randomCocktailName)}`;

    // AJAX request for fetching cocktail details
    $.ajax({
        url: cocktailUrl,
        method: 'GET',
        headers: {
            // Set request headers for the RapidAPI
            'X-RapidAPI-Key': '1e172b8f13msha7b25075b2fdae5p10d643jsn1e003f53eb44',
            'X-RapidAPI-Host': 'cocktail-by-api-ninjas.p.rapidapi.com'
        },
        success: function (response) {
            // If response is successful and contains data
            if (response && response.length > 0) {
                // Call the function to display cocktail details
                displayCocktailDetails(response);
            } else {
                // Display a message if no results found for the random cocktail name
                $('#results').html(`<p>No results found for '${randomCocktailName}'</p>`);
            }
        },
        error: function (xhr, status, error) {
            // Log error details to the console
            console.error("Request failed:", status, error);
            // Display an error message
            $('#results').html(`<p>Error: ${status} - ${error}</p>`);
        }
    });


    // Function to display cocktail details on the page
    function displayCocktailDetails(cocktailData) {
        var htmlString = "";

        // Loop through each cocktail in the response data
        for (var i = 0; i < cocktailData.length; i++) {
            var cocktail = cocktailData[i];
            var title = cocktail.name;
            var ingredients = cocktail.ingredients.join(', '); // Assuming ingredients is an array
            var instructions = cocktail.instructions;

            // Construct HTML markup for each cocktail detail
            htmlString += "<li>" + "<br>" + "<u>" + title + "</u>" + "<br>" + "Ingredients: " + ingredients + "</li>" + "<br>";
            htmlString += "<p>" + "Instructions: " + instructions + "<br>" + "<br>" + "</p>";

            // Add space between each result
            htmlString += "<hr>";
        }

        // Display the cocktail details on the page
        $("#results").html(htmlString);
    }
});
