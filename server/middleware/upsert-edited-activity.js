const axios = require('axios');

const upsertEditedActivity = async (req, res, next) => {
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
            req.editedActivity = result
            next();
            console.log('Upsert successful:', result);
        } else {
            res.status(404).send('No result found or created');
        }
    } catch (error) {
        console.error('Error performing upsert:', error);
        res.status(500).send('Something went wrong');
    }
}

module.exports = upsertEditedActivity