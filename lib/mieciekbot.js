const Discord = require('discord.js');
const CommandManager = require('./command_manager.js');
const EventLoader = require('./event_loader.js');
const DBManager = require('./db_manager.js');
require('./console_logger.js');

class MieciekBot extends Discord.Client {
    project_info = require('../package.json');
    
    prefix = '!';
    delete_timeout = 3000;
    roles = [];
    spam_channels = []
    queue = new Map();
    
    /** @type EventLoader */
    event_loader;
    /** @type CommandManager */
    command_manager;
    /** @type DBManager */
    db_manager;
    db_uri;

    /**
     * @param {String} bot_token
     * @param {String} database_uri
     * @param {Discord.ClientOptions} client_options 
     */
    constructor(discord_token, database_uri, client_options) {
        super(client_options);
        this.db_uri = database_uri;
        this.token = discord_token;
    }

    init() {
        console.info(`Initializing MieciekBot ${this.project_info.version}...\n`);

        this.event_loader = new EventLoader();
        this.command_manager = new CommandManager();
        this.db_manager = new DBManager(this.db_uri);
        this.login(this.token);
    }

    /** 
     * @param {Discord.TextChannel} channel 
     * @param {Message} msg 
     * @param {number} [timeout]
     */
    sendAndDelete(channel, msg, timeout) {
        if(!timeout && this.delete_timeout) timeout = this.delete_timeout;
        channel.send(msg).then(msg => msg.delete({ timeout: timeout }));
    }

    generateBotInvite(permissions) {
        if(!permissions) permissions = 8;
        let client_id = this.user.id;
        return `https://discordapp.com/oauth2/authorize?client_id=${client_id}&scope=bot&permissions=${permissions}`;
    }
}

module.exports = MieciekBot;