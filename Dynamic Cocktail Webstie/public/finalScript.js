// Function to handle form submission for searching cocktails
$(document).ready(function () {
    // Event handler for form submission
    $('#searchform').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the search term from the input field and trim any extra spaces
        var searchTerm = $("#searchterms").val().trim();

        // Check if the search term is not empty
        if (searchTerm !== "") {
            // Redirect to the index page with the search term as a query parameter
            window.location.href = '/?searchTerm=' + encodeURIComponent(searchTerm);
        }
    });

    // Function to perform cocktail search using AJAX
    function searchCocktail(searchTerm) {
        // URL for fetching cocktail details
        const url = 'https://cocktail-by-api-ninjas.p.rapidapi.com/v1/cocktail?name=' + encodeURIComponent(searchTerm);

        // AJAX settings for the request
        const settings = {
            async: true,
            crossDomain: true,
            url: url,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '1e172b8f13msha7b25075b2fdae5p10d643jsn1e003f53eb44',
                'X-RapidAPI-Host': 'cocktail-by-api-ninjas.p.rapidapi.com'
            },
        };

        // Perform the AJAX request
        $.ajax(settings)
            .done(function (response) {
                // Log the response to the console
                console.log("Response:", response);

                // Check if the response contains data
                if (response && response.length > 0) {
                    // Call the function to display cocktail details
                    displayCocktailDetails(response);
                } else {
                    // Display a message if no results found for the search term
                    $("#results").html("<p>No results found for '" + searchTerm + "'</p>");
                }
            })
            .fail(function (xhr, status, error) {
                // Log the error details to the console
                console.error("Request failed:", status, error);

                // Handle different types of errors
                if (xhr.status === 401) {
                    // Unauthorized error (invalid API key)
                    $("#results").html("<p>Unauthorized: Check API key</p>");
                } else {
                    // Display a generic error message
                    $("#results").html("<p>Error: " + status + " - " + error + "</p>");
                }
            });
    }

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

    // Check if there's a search term in the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('searchTerm');
    if (searchTerm) {
        // If there's a search term, perform the cocktail search
        searchCocktail(searchTerm);
    }
});


// Function to handle login form submission
(function() {
    // Wait for the document to be ready
    $(document).ready(function () {
        // Remove any existing event handlers for the login form
        $('#loginForm').off('submit');

        // Event handler for login form submission
        $('#loginForm').submit(function (event) {
            event.preventDefault(); // Prevent the default form submission behavior

            // Get the username and password from the input fields and trim any extra spaces
            var name = $("#username").val().trim();
            var password = $("#password").val().trim();

            // Check if both the username and password are not empty
            if (name !== "" && password !== "") {
                // Make an AJAX request to handle login
                $.ajax({
                    url: '/login', // Endpoint for handling login
                    method: 'POST',
                    data: { name: name, password: password },
                    success: function (response) {
                        // Handle the login success
                        console.log('Login successful');
                        window.location.href = '/'; // Redirect user to index page
                        alert("Login successful.");
                    },
                    error: function (xhr, status, error) {
                        // Handle the login error
                        console.error("Login failed:", status, error);
                        alert("Login failed. Please try again.");
                    }
                });
            }
        });
    });
})();

// Event handler for create account form submission
$('#createAccountForm').submit(function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the new username and password from the input fields and trim any extra spaces
    var name = $("#username").val().trim();
    var password = $("#password").val().trim();

    // Check if both the new username and password are not empty
    if (name !== "" && password !== "") {
        // Make an AJAX request to check if the username exists
        $.ajax({
            url: '/createAccount', // Endpoint for creating an account
            method: 'POST',
            data: { name: name, password: password },
            success: function (response) {
                // Handle the response from the server
                console.log('Response:', response);
                if (response === 'User registered successfully') {
                    // If the account creation was successful, show a success message
                    console.log('Account created successfully');
                    alert("Account created successfully");
                    // redirect the user to login page
                    window.location.href = '/login';
                } else {
                    // If the username already exists, show an alert
                    alert("Username already exists. Please choose another.");
                }
            },
            error: function (xhr, status, error) {
                // Handle the account creation error
                console.error("Account creation failed:", status, error);
                if (xhr.status === 409) {
                    // If the username already exists, show an alert
                    alert("Username already exists. Please choose another.");
                } else {
                    // Display a generic error message for other errors
                    alert("Account creation failed");
                }
            }
        });
    }
});

// Function to handle profile update
function updateProfile() {
    // Get the form data (username and password)
    var formData = {
        name: $("#username").val().trim(),
        password: $("#password").val().trim()
    };

    // Make an AJAX request to update the profile
    $.ajax({
        url: '/profile', // Endpoint for updating profile
        method: 'POST',
        data: formData,
        success: function (response) {
            // Handle the profile update success
            console.log('Profile updated successfully');
            alert('Profile updated successfully'); // Show an alert to the user
        },
        error: function (xhr, status, error) {
            // Handle the profile update error
            console.error('Profile update failed:', status, error);
            alert('Profile update failed. Please try again.'); // Show an alert to the user
        }
    });
}

// Wait for the document to be ready
$(document).ready(function () {   
    // Event handler for profile update button click
    $('#updateProfileBtn').off('click').on('click', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        updateProfile(); // Call the function to handle profile update
    });
});
