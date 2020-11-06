const MieciekBot = require('./mieciekbot.js');
const EXPSystem = require('./exp_system.js');
const fs = require('fs');
const mongoose = require('mongoose');

class DBManager {
    /** @type String */
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
            spam_channels: []
        });
    }

    async getServer(guild_id) {
        return await this.Server.findOne({ serverID: guild_id }).exec();
    }
    
    async getServerUsers(guild_id) {
        return await this.User.find({ serverID: guild_id }).exec();
    }

    deleteServer(guild_id) {
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

    defaultUser(guild_id, member_id) {
        return new this.User({
            serverID: guild_id,
            userID: member_id, level: 0, xp: 0
        });
    }

    async getUser(guild_id, member_id) {
        return await this.User.findOne({ serverID: guild_id, userID: member_id }).exec();
    }

    deleteUser(guild_id, member_id) {
        this.User.deleteOne({ serverID: guild_id, userID: member_id }, err => {
            if(err) console.error(err);
        });

        this.Warn.deleteMany({ serverID: guild_id, userID: member_id }, err => {
            if(err) console.error(err);
        });
    }

    /** @param {MieciekBot} bot */
    async databaseCleanup(bot) {
        bot.guilds.cache.forEach(async guild => {
            // delete old members
            let db_guild_members = await this.getServerUsers(guild.id);
            let guild_users = guild.members.cache.filter(member => !member.user.bot);
            db_guild_members.forEach(member => {
                if(!guild_users.delete(member.userID))
                {
                    bot.emit('guildMemberRemove', {
                        id: member.userID,
                        guild: { id: guild.id }
                    });
                    console.debug(`Deleting old guild member from the database... (GID:${guild.id} UID:${member.userID})`);
                }
            });
            
            // add new guilds
            let db_guild = await this.Server.findOne({ serverID: guild.id }).exec();
            if(!db_guild)
            {
                bot.emit('guildCreate', guild, true);
                console.debug(`Adding new guild to the database... (GID:${guild.id})`);
            }
            
            // add new members
            guild.members.cache.forEach(async member => {
                let db_member = await this.User.findOne({ serverID: guild.id, userID: member.id }).exec();
                if(!db_member && !member.user.bot)
                {
                    bot.emit('guildMemberAdd', member);
                    console.debug(`Adding new guild member to the database... (GID:${guild.id} UID:${member.id})`);
                }
            });
        });
        
        // delete old guilds
        let db_guilds = await this.Server.find({}).exec();
        let bot_guilds = bot.guilds.cache;
        db_guilds.forEach(guild => {
            if(!bot_guilds.delete(guild.serverID))
            {
                bot.emit('guildDelete', { id: guild.serverID });
                console.debug(`Deleting old guild and its members from the database... (GID:${guild.serverID})`);
            }
        });
    }
}

module.exports = DBManager;