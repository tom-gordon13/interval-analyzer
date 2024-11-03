const mongoose = require('mongoose');

const ActivityBasicSchema = new mongoose.Schema({
    activity_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true,
        unique: false
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    sport_type: {
        type: String,
        required: true,
        unique: false
    },
    activity_date: {
        type: Date,
        required: false
    },
    most_recent_view: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const ActivityBasic = mongoose.model('activity_basic', ActivityBasicSchema);
module.exports = ActivityBasic;