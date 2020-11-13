const mongoose = require('mongoose');
const Music = require('../lib/music.js');

const savedQueueSchema = mongoose.Schema({
    serverID: String,
    name: String,
    urls: [String],
    timestamp: String
});

module.exports = mongoose.model('SavedQueue', savedQueueSchema);
