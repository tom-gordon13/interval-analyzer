const mongoose = require('mongoose');

const ActivityBasicSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
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
    }
});

const ActivityBasic = mongoose.model('activity_basic', ActivityBasicSchema);
module.exports = ActivityBasic;