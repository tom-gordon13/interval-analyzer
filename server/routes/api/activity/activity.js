const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const EditedActivity = require('../../../schemas/EditedActivity')

const getActivityDetails = require('../../../middleware/fetch-activity')
const fetchActivityDetails = require('../../../middleware/fetch-activity-plus')
const updateActivityDetails = require('../../../middleware/update-activity-details')
const extractAccessToken = require('../../../middleware/extract-access-token')
const fetchEditedActivity = require('../../../middleware/fetch-edited-activity')
const upsertEditedActivity = require('../../../middleware/upsert-edited-activity')

const app = express();
const router = express.Router();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors());

router.get('/:activityId', getActivityDetails, fetchActivityDetails, (req, res) => {
    const activityDetails = req.activityDetails;
    const extra = req.activityDetailsExtra
    res.json(activityDetails);
});

router.get('/:activityId/edited-activity', fetchEditedActivity, async (req, res) => {
    const editedActivity = req.editedActivity
    res.json(editedActivity)
});

router.post('/:activityId/edited-activity', upsertEditedActivity, async (req, res) => {
    const editedActivity = req.editedActivity
    res.json(editedActivity)
})

router.put('/:activityId', extractAccessToken, updateActivityDetails, (req, res) => {
    const updatedActivity = req.updatedActivity;
    res.json(updatedActivity)
})


module.exports = router;