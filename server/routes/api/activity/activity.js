const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const getActivityDetails = require('../../../middleware/fetch-activity')
const fetchActivityDetails = require('../../../middleware/fetch-activity-plus')
const updateActivityDetails = require('../../../middleware/update-activity-details')
const extractAccessToken = require('../../../middleware/extract-access-token')

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

router.get('/:activityId', getActivityDetails, fetchActivityDetails, (req, res) => {
    const activityDetails = req.activityDetails;
    const extra = req.activityDetailsExtra
    res.json(activityDetails);
});

router.put('/:activityId', extractAccessToken, updateActivityDetails, (req, res) => {
    const updatedActivity = req.updatedActivity;
    res.json(updatedActivity)
})


module.exports = router;