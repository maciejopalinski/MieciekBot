const mongoose = require('mongoose');

const Client = require('../client/Client');
const ExperienceSystem = require('../experience/ExperienceSystem');

const SavedQueue = require('./types/SavedQueue');
const Server     = require('./types/Server');
const User       = require('./types/User');
const Warn       = require('./types/Warn');

class DatabaseManager {
    /** @type {string} */ db_uri;
    exp_system = new ExperienceSystem();

    models = {
        SavedQueue: require('../../models/SavedQueue'),
        Server:     require('../../models/Server'),
        User:       require('../../models/User'),
        Warn:       require('../../models/Warn')
    };

    /** @param {string} database_uri */
    constructor(database_uri) {
        this.db_uri = database_uri;
        this.connect();
    }

    connect() {
        mongoose.connect(this.db_uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    // GET
    /** @returns {Promise<Server>} */
    async getServer(guild_id) {
        return await this.models.Server.findOne({ serverID: guild_id }).exec();
    }
    /** @returns {Promise<User>} */
    async getUser(guild_id, member_id) {
        return await this.models.User.findOne({ serverID: guild_id, userID: member_id }).exec();
    }
    /** @returns {Promise<User[]>} */
    async getServerUsers(guild_id) {
        return await this.models.User.find({ serverID: guild_id }).exec();
    }
    /** @returns {Promise<Warn[]>} */
    async getWarns(guild_id, member_id) {
        return await this.models.Warn.find({ serverID: guild_id, userID: member_id }).exec();
    }
    /** @returns {Promise<SavedQueue>} */
    async getSavedQueue(guild_id, name) {
        return await this.models.SavedQueue.findOne({ serverID: guild_id, name: name }).exec();
    }
    /** @returns {Promise<SavedQueue[]>} */
    async getAllSavedQueues(guild_id) {
        return await this.models.SavedQueue.find({ serverID: guild_id }).exec();
    }

    // DELETE
    async deleteServer(guild_id) {
        this.models.Server.deleteOne({ serverID: guild_id }, err => {
            if(err) console.error(err);
        });

        this.models.User.deleteMany({ serverID: guild_id }, err => {
            if(err) console.error(err);
        });

        this.models.Warn.deleteMany({ serverID: guild_id }, err => {
            if(err) console.log(err);
        });
    }
    async deleteUser(guild_id, member_id) {
        this.models.User.deleteOne({ serverID: guild_id, userID: member_id }, err => {
            if(err) console.error(err);
        });

        this.models.Warn.deleteMany({ serverID: guild_id, userID: member_id }, err => {
            if(err) console.error(err);
        });
    }
    async deleteSavedQueue(guild_id, name) {
        return await this.models.SavedQueue.deleteOne({ serverID: guild_id, name: name }).exec();
    }

    // DEFAULT
    defaultServer(guild_id) {
        return new this.models.Server({
            serverID: guild_id,
            prefix: '!',
            delete_timeout: 3000,
            roles: {
                owner: '000000000',
                admin: '000000000',
                dj: '000000000',
                user: '000000000',
                mute: '000000000'
            },
            announce: {
                channel: '000000000',
                add_member: false,
                remove_member: false
            },
            spam_channels: []
        });
    }
    defaultUser(guild_id, member_id) {
        return new this.models.User({
            serverID: guild_id,
            userID: member_id, level: 0, xp: 0
        });
    }
    defaultSavedQueue(guild_id, name) {
        return new this.models.SavedQueue({
            serverID: guild_id,
            name: name,
            urls: []
        });
    }

    /** @param {Client} bot */
    async databaseCleanup(bot) {
        
        // add new guilds
        bot.guilds.cache.forEach(async guild => {            
            let db_guild = await this.models.Server.findOne({ serverID: guild.id }).exec();
            if(!db_guild)
            {
                bot.emit('guildCreate', guild);
                console.debug(`Adding new guild to the database... (GID:${guild.id})`);
            }
        });
        
        // delete old guilds
        let db_guilds = await this.models.Server.find({}).exec();
        db_guilds.forEach(guild => {
            if(!bot.guilds.cache.has(guild.serverID))
            {
                bot.emit('guildDelete', { id: guild.serverID });
                console.debug(`Deleting old guild and its members from the database... (GID:${guild.serverID})`);
            }
        });
    }
}

module.exports = DatabaseManager;