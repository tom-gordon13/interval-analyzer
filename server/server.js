const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios')
const querystring = require('querystring');

dotenv.config({ path: './.env' }); // Load environment variables from .env file

const app = express();

// Enable CORS for all routes
app.use(cors());

// Allow requests from the client-side app (localhost:3001)
const corsOptions = {
    origin: 'http://localhost:3001',
};

app.use(cors(corsOptions));

// Serve your React application (assuming it's in a 'build' directory)
app.use(express.static('build'));

const routes = require('../server/routes/api/auth-api'); // Adjust the path as needed
app.use('/', routes);

// Start the server on a specific port
// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});