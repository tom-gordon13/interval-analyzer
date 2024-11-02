const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const router = express.Router();

const ActivityBasic = require('../../../schemas/ActivityBasic')

app.use(express.json());
app.use(cookieParser());
app.use(cors());

router.get('/:userId/activity-basic', (req, res) => {

});

router.put('/:userId/activity-basic/:activityId', async (req, res) => {
    try {
        // const { userId, activityId } = req.params;
        const { _id, ...activity } = req.body;
        activity.most_recent_view = Date.now()
        const result = await ActivityBasic.findOneAndUpdate(
            { activity_id: activity.activity_id },
            activity,
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
});

module.exports = router;