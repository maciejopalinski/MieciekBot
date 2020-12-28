import * as Discord from 'discord.js';

import { IGuild } from '../models';
import { CommandManager, EventLoader, DatabaseManager, RolePermissionNode, UserPermissionNode, AnyPermissionNode, PermissionNodesManager, MusicManager } from './';

import * as project_info from '../package.json';

interface ServerAnnounceToggles {
    add_member: boolean;
    remove_member: boolean;
}

interface ServerAnnounceOptions {
    
    channel_id: string;
    channel: Discord.TextChannel | Discord.NewsChannel;
	toggles: ServerAnnounceToggles;
}

interface ClientRoles {
    user: AnyPermissionNode;
    manager: PermissionNodesManager;
}

export type Channel = Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;

export class Client extends Discord.Client {
    
    project_info = project_info;
    version: string;
    debug = false;

    prefix = '!';
    delete_timeout = 3000;

    roles: ClientRoles = {
        user: undefined,
        manager: undefined
    };

    announce_options: ServerAnnounceOptions = {
        channel_id: '',
        channel: null,
        toggles: {
            add_member: false,
            remove_member: false
        }
    };

    spam_channels: string[] = [];

    event_loader: EventLoader;
    command_manager: CommandManager;
    db_manager: DatabaseManager;
    db_uri: string;
    music_manager: MusicManager;

    constructor(discord_token: string, database_uri: string, client_options?: Discord.ClientOptions) {
        super(client_options);
        this.db_uri = database_uri;
        this.token = discord_token;
        this.music_manager = new MusicManager();
    }

    async init() {
        require('./ConsoleLogger');
        
        this.version = this.project_info.version;
        if (process.env.DEBUG == 'true') {
            this.version += '-dev';
            this.debug = true;
        }

        console.info(`Initializing MieciekBot ${this.version}...\n`);

        this.event_loader = new EventLoader();
        this.command_manager = new CommandManager();
        this.db_manager = new DatabaseManager(this.db_uri);
        await this.login(this.token);
    }

    async sendAndDelete(channel: Channel, msg: string, timeout = this.delete_timeout) {        
        await channel.send(msg).then(msg => msg.delete({ timeout }));
    }

    deleteMsg(msg: Discord.Message, timeout = this.delete_timeout) {
        msg.delete({ timeout });
    }

    setAnnounceOptions(options: IGuild) {
        this.announce_options.toggles.add_member = options.announce.toggles.add_member;
        this.announce_options.toggles.remove_member = options.announce.toggles.remove_member;
    }

    async setAnnounceChannel(channel_id: string) {
        this.announce_options.channel_id = channel_id;
        
        try {
            let channel: any = await this.channels.fetch(channel_id);
            this.announce_options.channel = channel;

        } catch(err) {
            return false;
        }

        return true;
    }

    announce(channel: Channel, text: string) {
        if(this.announce_options.channel) return this.announce_options.channel.send(text);
        else if(channel) return channel.send(text);
    }

    generateBotInvite(permissions: number = 8) {
        return `https://discordapp.com/oauth2/authorize?client_id=${this.user.id}&scope=bot&permissions=${permissions}`;
    }

    generateUUID(length: number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    kill() {
        this.destroy();
        process.exit();
    }
}