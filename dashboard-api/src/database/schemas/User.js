const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    tag: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    guilds: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Dashboard_User', UserSchema);