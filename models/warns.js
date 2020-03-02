const mongoose = require("mongoose");

const warnsSchema = mongoose.Schema({
	serverID: String,
    userID: String,
    warnedBy: String,
    reason: String,
    timestamp: String
});

module.exports = mongoose.model("Warns", warnsSchema);