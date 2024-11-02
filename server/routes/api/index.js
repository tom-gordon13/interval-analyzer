const express = require('express');
const router = express.Router();

// Import individual route files
const authRoutes = require('./auth-api');
// const userRoutes = require('./user-api');
const activityRoutes = require('./activity/activity');
const userRoutes = require('./user/user')

// Use the imported routers with the main router
router.use('/', authRoutes);
router.use('/activity', activityRoutes);
router.use('/user', userRoutes);

module.exports = router;