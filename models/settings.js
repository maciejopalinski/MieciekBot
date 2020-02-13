const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
	serverID: String,
	prefix: String,
	delete_timeout: Number,
	roles: {
		owner: String,
		admin: String,
		user: String,
		mute: String
	}
});

module.exports = mongoose.model("Settings", settingsSchema);
