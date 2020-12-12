const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	serverID: String,
    userID: String,
    level: Number,
    xp: Number
});

module.exports = mongoose.model('User', UserSchema);