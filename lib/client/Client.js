const Discord = require('discord.js');

const CommandManager = require('../command/CommandManager');
const EventLoader = require('../event/EventLoader');
const DBManager = require('../database/DatabaseManager');

const RolePermissionNode = require('../permission/node/RolePermissionNode');
const UserPermissionNode = require('../permission/node/UserPermissionNode');
const PermissionNodesManager = require('../permission/PermissionNodesManager');

const MusicManager = require('../music/MusicManager');
const Server = require('../database/types/Server');

class Client extends Discord.Client {
    
    project_info = require('../../package.json');
    /** @type {string} */ version;
    /** @type {boolean} */ debug = false;

    prefix = '!';
    delete_timeout = 3000;
    
    roles = {
        /** @type {RolePermissionNode|UserPermissionNode} */
        user: undefined,
        /** @type {PermissionNodesManager} */
        manager: undefined
    };

    /** @type {ServerAnnounceOptions} */ announce_options = new ServerAnnounceOptions();

    /** @type {string[]} */ spam_channels = [];

    /** @type {EventLoader} */ event_loader;
    /** @type {CommandManager} */ command_manager;
    /** @type {DBManager} */ db_manager;
    /** @type {string} */ db_uri;
    /** @type {MusicManager} */ music_manager;

    /**
     * @param {string} discord_token
     * @param {string} database_uri
     * @param {Discord.ClientOptions} client_options 
     */
    constructor(discord_token, database_uri, client_options) {
        super(client_options);
        this.db_uri = database_uri;
        this.token = discord_token;
        this.music_manager = new MusicManager();
    }

    async init() {
        require('../util/ConsoleLogger');
        
        this.version = this.project_info.version;
        if (process.env.DEBUG == 'true') {
            this.version += '-dev';
            this.debug = true;
        }
        console.info(`Initializing MieciekBot ${this.version}...\n`);

        this.event_loader = new EventLoader();
        this.command_manager = new CommandManager();
        this.db_manager = new DBManager(this.db_uri);
        await this.login(this.token);
    }

    /** 
     * @param {Discord.TextChannel} channel 
     * @param {Discord.Message} msg 
     * @param {number} [timeout]
     */
    async sendAndDelete(channel, msg, timeout) {
        if(timeout == undefined && this.delete_timeout) timeout = this.delete_timeout;
        await channel.send(msg).then(msg => msg.delete({ timeout: timeout }));
    }

    /**
     * @param {Discord.Message} msg 
     * @param {number} timeout 
     */
    deleteMsg(msg, timeout) {
        if(timeout == undefined && this.delete_timeout) timeout = this.delete_timeout;
        msg.delete({ timeout: timeout });
    }

    /** @param {Server} options */
    setAnnounceOptions(options) {
        this.announce_options.toggles.add_member = options.announce.toggles.add_member;
        this.announce_options.toggles.remove_member = options.announce.toggles.remove_member;
    }

    /** @param {string} */
    async setAnnounceChannel(channel_id) {
        this.announce_options.channel_id = channel_id;
        
        let channel_resolved = this.channels.resolve(channel_id);
        if(channel_id && channel_resolved) {
            let channel = await this.channels.fetch(channel_resolved.id);
            if (channel) this.announce_options.channel = channel_resolved;
        }

        return this.announce_options.channel;
    }

    /**
     * @param {Discord.TextChannel} channel
     * @param {string} text
     */
    announce(channel, text) {
        if(this.announce_options.channel) return this.announce_options.channel.send(text);
        else if(channel) return channel.send(text);
    }

    /**
     * @param {number} permissions 
     */
    generateBotInvite(permissions) {
        if(permissions == undefined) permissions = 8;
        let client_id = this.user.id;
        return `https://discordapp.com/oauth2/authorize?client_id=${client_id}&scope=bot&permissions=${permissions}`;
    }

    /**
     * @param {number} length
     * @param {string} characters
     */
    generateUUID(length, characters) {
        if(characters == undefined) characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    kill() {
        this.destroy();
        process.exit();
    }
}

class ServerAnnounceOptions {
    
    /** @type {string} */ channel_id = "";
    /** @type {Discord.TextChannel | null} */ channel = null;

	toggles = {
        /** @type {boolean} */ add_member: false,
        /** @type {boolean} */ remove_member: false
	}
}

module.exports = Client;