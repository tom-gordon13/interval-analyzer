const mongoose = require('mongoose');

const EditedActivitySchema = new mongoose.Schema({
    edited_activity_id: {
        type: String,
        required: true,
        unique: true
    },
    original_activity_id: {
        type: String,
        required: true,
        unique: false
    },
    activity_data: {
        type: Object,
        required: true,
        unique: false
    },
    user_id: {
        type: String,
        required: true,
        unique: false
    },
    uploaded_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const EditedActivity = mongoose.model('edited_activity', EditedActivitySchema);
module.exports = EditedActivity;