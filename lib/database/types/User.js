const mongoose = require('mongoose');

class User extends mongoose.Document {
    /** @type {string} */ serverID;
    /** @type {string} */ userID;
    /** @type {number} */ level;
    /** @type {number} */ xp;
}

module.exports = User;