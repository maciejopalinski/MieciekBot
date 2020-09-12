const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	serverID: String,
    userID: String,
    level: Number,
    xp: Number
});

module.exports = mongoose.model("User", userSchema);
