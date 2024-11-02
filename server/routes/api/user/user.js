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

router.post('/:userId/activity-basic/:actvityId', async (req, res) => {

    try {
        // const user = new User(req.body);
        const activity = new ActivityBasic(req.body);
        // let result = await user.save();
        const result = await activity.save()
        result = result.toObject();
        if (result) {
            // delete result.password;
            resp.send(req.body);
            console.log(result);
        } else {
            console.log("No result provided");
        }

    } catch (e) {
        console.log(e)
        // resp.send("Something Went Wrong");
    }
});

module.exports = router;