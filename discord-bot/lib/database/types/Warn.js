const mongoose = require('mongoose');

class Warn extends mongoose.Document {
    /** @type {string} */ serverID;
    /** @type {string} */ userID;
    /** @type {string} */ warnedBy;
    /** @type {string} */ reason;
    /** @type {string} */ timestamp;
}

module.exports = Warn;