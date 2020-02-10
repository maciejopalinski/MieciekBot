const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
	serverID: String,
	prefix: String,
	delete_timeout: Number,
	roles: {
		owner: String,
		admin: String,
		user: String,
		muted: String
	}
});

module.exports = mongoose.model("Settings", settingsSchema);
