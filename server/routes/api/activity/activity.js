const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const EditedActivity = require('../../../schemas/EditedActivity')

const getActivityDetails = require('../../../middleware/fetch-activity')
const fetchActivityDetails = require('../../../middleware/fetch-activity-plus')
const updateActivityDetails = require('../../../middleware/update-activity-details')
const extractAccessToken = require('../../../middleware/extract-access-token')

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

router.get('/:activityId/edited-activity', async (req, res) => {
    const { activityId } = req.params;
    try {
        const result = await EditedActivity.findOne({ original_activity_id: activityId })

        if (!result) {
            res.status(200).json({
                response: 'No edited activity found'
            });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error('Error fetching edited activity:', error);
        res.status(500).send('Something went wrong');
    }

});

router.post('/:activityId/edited-activity', async (req, res) => {
    try {
        const activity_data = req.body;
        const userId = activity_data.athlete.id

        const edited_activity = {
            edited_activity_id: activity_data.id + '_e',
            original_activity_id: activity_data.id,
            activity_data: activity_data,
            user_id: userId,
            uploaded_at: Date.now()
        }

        const result = await EditedActivity.findOneAndUpdate(
            { edited_activity_id: String(edited_activity.edited_activity_id) },
            { $set: edited_activity },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (result) {
            res.status(200).json(result);
            console.log('Upsert successful:', result);
        } else {
            res.status(404).send('No result found or created');
        }
    } catch (error) {
        console.error('Error performing upsert:', error);
        res.status(500).send('Something went wrong');
    }
})

router.put('/:activityId', extractAccessToken, updateActivityDetails, (req, res) => {
    const updatedActivity = req.updatedActivity;
    res.json(updatedActivity)
})


module.exports = router;