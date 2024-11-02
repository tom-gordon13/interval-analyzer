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

router.post('/:userId/activity-basic/:actvityId', (req, res) => {
    const activity = new ActivityBasic(req.body);
    console.log(activity)
});

module.exports = router;