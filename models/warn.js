const mongoose = require("mongoose");

const warnSchema = mongoose.Schema({
	serverID: String,
    userID: String,
    warnedBy: String,
    reason: String,
    timestamp: String
});

module.exports = mongoose.model("Warn", warnSchema);