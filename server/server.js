const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios')
const querystring = require('querystring');
const mongoose = require('mongoose')

dotenv.config({ path: './.env' }); // Load environment variables from .env file

const app = express();
app.use(express.json({ limit: '10mb' }));

// Enable CORS for all routes
app.use(cors());

// Allow requests from the client-side app (localhost:3001)
const corsOptions = {
    origin: 'http://localhost:3001',
};

app.use(cors(corsOptions));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.MONGO_DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to ${process.env.MONGO_DB_NAME} database`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

connectDB();

// Serve your React application (assuming it's in a 'build' directory)
app.use(express.static('build'));

// const routes = require('../server/routes/api/auth-api');
// // const routes = require('../server/routes/api/activity/activity');
// app.use('/', routes);

const routes = require('./routes/api'); // This will import from /routes/index.js
// Use the routes with a prefix like /api (optional)
// app.use('/api', routes);
app.use('/', routes);

// Start the server on a specific port
// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});