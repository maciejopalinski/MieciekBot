const {Client} = require('./mieciekbot.js');
const EXPSystem = require('./exp_system.js');
const mongoose = require('mongoose');

class DBManager {
    /** @type {String} */
    db_uri;
    exp_system = EXPSystem;

    constructor(database_uri) {
        this.db_uri = database_uri;
        this.connect();
    }

    connect() {
        mongoose.connect(this.db_uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    Server = require('../models/server.js');
    User = require('../models/user.js');
    Warn = require('../models/warn.js');
    SavedQueue = require('../models/saved-queue.js');

    // GET
    async getServer(guild_id) {
        return await this.Server.findOne({ serverID: guild_id }).exec();
    }
    async getUser(guild_id, member_id) {
        return await this.User.findOne({ serverID: guild_id, userID: member_id }).exec();
    }
    async getServerUsers(guild_id) {
        return await this.User.find({ serverID: guild_id }).exec();
    }
    async getWarns(guild_id, member_id) {
        return await this.Warn.find({ serverID: guild_id, userID: member_id }).exec();
    }
    async getSavedQueue(guild_id, name) {
        return await this.SavedQueue.findOne({ serverID: guild_id, name: name }).exec();
    }
    async getAllSavedQueues(guild_id) {
        return await this.SavedQueue.find({ serverID: guild_id }).exec();
    }

    // DELETE
    async deleteServer(guild_id) {
        this.Server.deleteOne({ serverID: guild_id }, err => {
            if(err) console.error(err);
        });

        this.User.deleteMany({ serverID: guild_id }, err => {
            if(err) console.error(err);
        });

        this.Warn.deleteMany({ serverID: guild_id }, err => {
            if(err) console.log(err);
        });
    }
    async deleteUser(guild_id, member_id) {
        this.User.deleteOne({ serverID: guild_id, userID: member_id }, err => {
            if(err) console.error(err);
        });

        this.Warn.deleteMany({ serverID: guild_id, userID: member_id }, err => {
            if(err) console.error(err);
        });
    }
    async deleteSavedQueue(guild_id, name) {
        return await this.SavedQueue.deleteOne({ serverID: guild_id, name: name }).exec();
    }

    // DEFAULT
    defaultServer(guild_id) {
        return new this.Server({
            serverID: guild_id,
            prefix: '!',
            delete_timeout: 3000,
            roles: {
                owner: '',
                admin: '',
                dj: '',
                user: '',
                mute: ''
            },
            announce: {
                add_member: false,
                remove_member: false
            },
            announce_channel: '',
            spam_channels: []
        });
    }
    defaultUser(guild_id, member_id) {
        return new this.User({
            serverID: guild_id,
            userID: member_id, level: 0, xp: 0
        });
    }
    defaultSavedQueue(guild_id, name) {
        let date = new Date();
        let date_string = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        return new this.SavedQueue({
            serverID: guild_id,
            name: name,
            urls: [],
            timestamp: date_string
        });
    }

    /** @param {Client} bot */
    async databaseCleanup(bot) {
        
        // add new guilds
        bot.guilds.cache.forEach(async guild => {            
            let db_guild = await this.Server.findOne({ serverID: guild.id }).exec();
            if(!db_guild)
            {
                bot.emit('guildCreate', guild);
                console.debug(`Adding new guild to the database... (GID:${guild.id})`);
            }
        });
        
        // delete old guilds
        let db_guilds = await this.Server.find({}).exec();
        db_guilds.forEach(guild => {
            if(!bot.guilds.cache.has(guild.serverID))
            {
                bot.emit('guildDelete', { id: guild.serverID });
                console.debug(`Deleting old guild and its members from the database... (GID:${guild.serverID})`);
            }
        });
    }
}

module.exports = DBManager;