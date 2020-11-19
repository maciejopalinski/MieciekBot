const Discord = require('discord.js');
const CommandManager = require('./command_manager.js');
const EventLoader = require('./event_loader.js');
const DBManager = require('./db_manager.js');
const Music = require('./music.js');

class Client extends Discord.Client {
    
    project_info = require('../package.json');
    /** @type {String} */
    version;
    /** @type {Boolean} */
    debug = false;

    prefix = '!';
    delete_timeout = 3000;
    music_queue;

    roles = {
        /** @type {RolePermissionNode|UserPermissionNode} */
        user: undefined,
        /** @type {PermissionNodesManager} */
        manager: undefined
    };

    /** @type {String} */
    announce_channel_id;
    /** @type {Discord.TextChannel} */
    announce_channel;
    announce_opts = {
        add_member: false,
        remove_member: false
    };

    /** @type {Array<Discord.TextChannel>} */
    spam_channels = [];

    /** @type {EventLoader} */
    event_loader;
    /** @type {CommandManager} */
    command_manager;
    /** @type {DBManager} */
    db_manager;
    db_uri;

    /**
     * @param {String} discord_token
     * @param {String} database_uri
     * @param {Discord.ClientOptions} client_options 
     */
    constructor(discord_token, database_uri, client_options) {
        super(client_options);
        this.db_uri = database_uri;
        this.token = discord_token;
        this.music_queue = new Music.MusicManager();
    }

    async init() {
        require('./console_logger.js');
        
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
     * @param {Number} [timeout]
     */
    async sendAndDelete(channel, msg, timeout) {
        if(timeout == undefined && this.delete_timeout) timeout = this.delete_timeout;
        await channel.send(msg).then(msg => msg.delete({ timeout: timeout }));
    }

    /**
     * @param {Discord.Message} msg 
     * @param {Number} timeout 
     */
    deleteMsg(msg, timeout) {
        if(timeout == undefined && this.delete_timeout) timeout = this.delete_timeout;
        msg.delete({ timeout: timeout });
    }

    setAnnounceChannel(channel_id) {
        this.announce_channel_id = channel_id;
        
        if(channel_id) this.announce_channel = this.channels.resolve(channel_id);
        return this.announce_channel;
    }

    /**
     * @param {Discord.TextChannel} channel
     * @param {String} text
     */
    announce(channel, text) {
        if(this.announce_channel) return this.announce_channel.send(text);
        else if(channel) return channel.send(text);
    }

    /**
     * @param {Number} permissions 
     */
    generateBotInvite(permissions) {
        if(permissions == undefined) permissions = 8;
        let client_id = this.user.id;
        return `https://discordapp.com/oauth2/authorize?client_id=${client_id}&scope=bot&permissions=${permissions}`;
    }

    /**
     * @param {number} length
     * @param {String} characters
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

class MessageEmbed extends Discord.MessageEmbed {

    /** @type {Client} */
    client;
    /** @type {Discord.Guild} */
    guild;

    /**
     * @param {Client} client
     * @param {Discord.Guild} [guild]
     * @param {Boolean} [guild_icon]
     * @param {Discord.MessageEmbed | Discord.MessageEmbedOptions} [data]
     */
    constructor(client, guild, guild_icon, data) {
        super(data);
        this.client = client;
        this.guild = guild;
        this.setCustomFooter();

        if(guild_icon == undefined) guild_icon = true;
        if(guild_icon) this.setThumbnail(this.guild.iconURL({ format: 'png', size: 4096 }));
    }

    setCustomFooter() {
        return this.setFooter(`Powered by MieciekBot ${this.client.version}`, this.client.user.avatarURL({ format: 'png', size: 4096 }));
    }
}

class PermissionNode {

    /** @type {String} */
    name;
    /** @type {Number} */
    priority;
    /** @type {Array<String>} */
    allowed_nodes;

    /**
     * @param {String} name 
     * @param {number} priority
     * @param {Array<String>} [allowed_nodes] 
     */
    constructor(name, priority, allowed_nodes) {
        this.name = name;
        this.priority = priority;
        
        if(allowed_nodes == undefined) allowed_nodes = [name];
        this.allowed_nodes = allowed_nodes;
    }
}

class UserPermissionNode extends PermissionNode {
    
    /** @type {String} */
    user_id;

    /**
     * @param {String} name 
     * @param {String} user_id 
     * @param {number} priority
     * @param {Array<String>} [allowed_nodes] 
     */
    constructor(name, user_id, priority, allowed_nodes) {
        super(name, priority, allowed_nodes);
        this.user_id = user_id;
    }
}

class RolePermissionNode extends PermissionNode {

    /** @type {String} */
    role_id;
    
    /**
     * @param {String} name 
     * @param {String} role_id 
     * @param {number} priority
     * @param {Array<String>} [allowed_nodes] 
     */
    constructor(name, role_id, priority, allowed_nodes) {
        super(name, priority, allowed_nodes);
        this.role_id = role_id;
    }
}

class PermissionNodesManager {

    /** @type {Discord.Guild} */
    guild;
    /** @type {Array<RolePermissionNode|UserPermissionNode>} */
    permission_nodes = [];

    /**
     * @param {Discord.Guild} guild 
     * @param {Array<RolePermissionNode|UserPermissionNode>} [permission_nodes]
     */
    constructor(guild, permission_nodes) {
        this.guild = guild;
        if(permission_nodes !== undefined) this.permission_nodes = permission_nodes;

        this.addNode(new RolePermissionNode('@everyone', this.guild.roles.everyone.id, 0));
        this.addNode(new UserPermissionNode('BOT_OWNER', '510925936393322497', 1000, ['USER', 'DJ', 'ADMIN', 'OWNER', 'BOT_OWNER']));
    }

    /** @param {String} name */
    getNode(name) {
        return this.permission_nodes.find(value => value.name.toLowerCase() == name.toLowerCase());
    }

    /** @param {RolePermissionNode|UserPermissionNode} node */
    addNode(node) {
        this.permission_nodes.push(node);
    }

    /** 
     * returns the highest permission node that user has access to
     * @param {Discord.GuildMember} user
     */
    getMemberNode(user) {
        let current_highest = this.getNode('@everyone');
        if(this.guild.ownerID == user.id) current_highest = this.getNode('OWNER');

        this.permission_nodes.forEach(node => {
            if(node instanceof RolePermissionNode) {
                if(user.roles.cache.has(node.role_id) && node.priority > current_highest.priority) current_highest = node;
            } else if(node instanceof UserPermissionNode) {
                if(user.id == node.user_id && node.priority > current_highest.priority) current_highest = node;
            }
        });

        return current_highest;
    }

    /**
     * checks if user has permission to issue given command
     * @param {object} command
     * @param {String} command.help.permission
     * @param {Discord.GuildMember} user
     */
    hasCommandPermission(command, user) {
        let command_node = this.getNode(command.help.permission);
        let user_node = this.getMemberNode(user);

        if(user_node.priority >= command_node.priority) return true;
        else return false;
    }
}

module.exports = {
    Client: Client,
    MessageEmbed: MessageEmbed,
    PermissionNode: PermissionNode,
    UserPermissionNode: UserPermissionNode,
    RolePermissionNode: RolePermissionNode,
    PermissionNodesManager: PermissionNodesManager,

    // discord.js
    Message: Discord.Message,
    MessageAttachment: Discord.MessageAttachment,
    Guild: Discord.Guild,
    GuildMember: Discord.GuildMember,
    
    // Music
    Song: Music.Song,
    ServerQueue: Music.ServerQueue,
    QueueLoopModes: Music.QueueLoopModes,
    MusicManager: Music.MusicManager
};