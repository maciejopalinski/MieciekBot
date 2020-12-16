const mongoose = require('mongoose');

class SavedQueue extends mongoose.Document {
    /** @type {string} */ serverID;
    /** @type {string} */ name;
    /** @type {string[]} */ urls;
}

module.exports = SavedQueue;