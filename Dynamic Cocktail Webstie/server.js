const express = require('express');
const session = require('express-session');
const MongoClient = require('mongodb-legacy').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
//const connectDB = require('./db');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'login';


const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: 'GetLit',
    resave: false,
    saveUninitialized: true
}));

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbname);
        console.log('Database connected successfully');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}






// Route for user login
app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const db = await connectDB();
        const user = await db.collection('people').findOne({ name, password });
        if (user) {
            req.session.loggedIn = true;
            req.session.name = name; // Store the user's name in the session
            console.log('User logged in successfully:', name, password);
            res.send('Login successful');
        } else {
            console.log('Invalid username or password:', name, password);
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Express route for logout
app.get('/logout', (req, res) => {
    // Destroy the user's session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Redirect to the login page after logout
            res.redirect('/login');
        }
    });
});



// Route for user registration
app.post('/createAccount', async (req, res) => {
    const { name, password } = req.body;
    try {
        const db = await connectDB(); // Call connectDB function to get the database object
        const existingUser = await db.collection('people').findOne({ name });
        if (existingUser) {
            res.status(409).send('User already exists'); // Sending 409 Conflict status code for existing user
        } else {
            // If the username doesn't exist, insert it into the database
            await db.collection('people').insertOne({ name, password });
            res.send('User registered successfully');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});




// Route for profile page and updating user profile
app.get('/profile', async (req, res) => {
    try {
        const db = await connectDB();
        const user = await db.collection('people').findOne({ name: req.session.name });
        if (user) {
            if (req.method === 'GET') {
                // Render profile page
                res.render('pages/profile', { user: user, loggedIn: req.session.loggedIn });
            } else if (req.method === 'POST') {
                // Update user information in the database
                await db.collection('people').updateOne({ name: req.session.name }, { $set: req.body });
                res.send('Profile updated successfully');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error processing profile request:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route for updating user profile
app.post('/profile', async (req, res) => {
    try {
        const db = await connectDB(); // Connect to the database
        // Update user information in the database
        await db.collection('people').updateOne({ name: req.session.name }, { $set: req.body });
        res.send('Profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Define other routes
app.get('/', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    if (searchTerm) {
        try {
            const response = await axios.get(`https://cocktail-by-api-ninjas.p.rapidapi.com/v1/cocktail?name=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'X-RapidAPI-Key': '1e172b8f13msha7b25075b2fdae5p10d643jsn1e003f53eb44',
                    'X-RapidAPI-Host': 'cocktail-by-api-ninjas.p.rapidapi.com'
                }
            });

            const cocktails = response.data;

            // Render the index page with search results
            res.render('pages/index.ejs', { searchTerm: searchTerm, cocktails: cocktails, loggedIn: req.session.loggedIn });
        } catch (error) {
            console.error("Error fetching data from the API:", error);
            res.status(500).send('Something went wrong!');
        }
    } else {
        // If no search term, render the index page without search results
        res.render('pages/index.ejs', { loggedIn: req.session.loggedIn });
    }
});

app.get('/about', (req, res) => {
    res.render('pages/about.ejs', { loggedIn: req.session.loggedIn });
});

app.get('/cotd', (req, res) => {
    // console.log('Resolved path:', path.join(__dirname, 'views', 'cotd.ejs'));
    res.render('pages/cotd.ejs', { loggedIn: req.session.loggedIn });
});

app.get('/contact', (req, res) => {
    res.render('pages/contact', { loggedIn: req.session.loggedIn });
});

app.get('/createAccount', (req, res) => {
    res.render('pages/createAccount.ejs', { loggedIn: req.session.loggedIn });
});

app.post('/searchResults', async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;

        const response = await axios.get(`https://cocktail-by-api-ninjas.p.rapidapi.com/v1/cocktail?name=${encodeURIComponent(searchTerm)}`, {
            headers: {
                'X-RapidAPI-Key': '1e172b8f13msha7b25075b2fdae5p10d643jsn1e003f53eb44',
                'X-RapidAPI-Host': 'cocktail-by-api-ninjas.p.rapidapi.com'
            }
        });

        const cocktails = response.data;

        res.render('searchResults', { searchTerm: searchTerm, cocktails: cocktails });
    } catch (error) {
        console.error("Error fetching data from the API:", error);
        res.status(500).send('Something went wrong!');
    }
});

app.get('/test', (req, res) => {
    res.send('Test route works!', { loggedIn: req.session.loggedIn });
});

// Render login page (GET request)
app.get('/login', (req, res) => {
    res.render('pages/login.ejs', { loggedIn: req.session.loggedIn });
});

// 404 error handler middleware
app.use((req, res) => {
    res.status(404).render('pages/404');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Internal Server Error: ${err.message}`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
