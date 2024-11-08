const axios = require('axios');

const fetchEditedActivity = async (req, res, next) => {
    const { activityId } = req.params;
    try {
        const result = await EditedActivity.findOne({ original_activity_id: activityId })

        if (!result) {
            res.status(200).json({
                response: 'No edited activity found'
            });
        } else {
            req.editedActivity = result
            next();
        }
    } catch (error) {
        console.error('Error fetching edited activity:', error);
        res.status(500).send('Something went wrong');
    }
}

module.exports = fetchEditedActivity