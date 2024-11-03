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

router.get('/:userId/activity-basic', async (req, res) => {
    try {
        const { userId } = req.params;
        const { quantity } = req.body

        const result = await ActivityBasic.find().sort({ most_recent_view: 1 }).limit(quantity)

        if (result) {
            res.status(200).json(result);
            console.log('Fetch successful:', result);
        } else {
            res.status(404).send('No records found');
        }
    } catch (error) {
        console.error('Error performing fetch:', error);
        res.status(500).send('Something went wrong');
    }
});

router.put('/:userId/activity-basic/:activityId', async (req, res) => {
    try {
        const { userId } = req.params;
        const activity = req.body;

        activity.most_recent_view = Date.now()
        activity.user_id = userId

        const result = await ActivityBasic.findOneAndUpdate(
            { activity_id: String(activity.activity_id) },
            { $set: activity },
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