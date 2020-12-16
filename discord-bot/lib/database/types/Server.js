const mongoose = require('mongoose');

class Server extends mongoose.Document {
    /** @type {string} */ serverID;
    /** @type {string} */ prefix;
    /** @type {number} */ delete_timeout;

    roles = {
        /** @type {string} */ owner: undefined,
        /** @type {string} */ admin: undefined,
        /** @type {string} */ dj: undefined,
        /** @type {string} */ user: undefined,
        /** @type {string} */ mute: undefined
    };

    announce = {
        /** @type {string} */ channel_id: undefined,

        toggles: {
            add_member: false,
            remove_member: false
        }
    }

    /** @type {string[]} */ spam_channels;
}

module.exports = Server;