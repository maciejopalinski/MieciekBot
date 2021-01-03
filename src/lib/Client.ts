import * as Discord from 'discord.js';
import * as project_info from '../../package.json';
import { CommandManager, EventLoader, DatabaseManager, MusicManager, GuildManager } from './';

export type Channel = Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;

export class Client extends Discord.Client {
    
    project_info = project_info;
    version: string;
    debug = false;

    guild: GuildManager;
    music_manager: MusicManager;

    event_loader: EventLoader;
    command_manager: CommandManager;
    db_manager: DatabaseManager;
    db_uri: string;

    constructor(discord_token: string, database_uri: string, client_options?: Discord.ClientOptions) {
        super(client_options);
        
        require('./ConsoleLogger');

        this.version = this.project_info.version;
        if (process.env.DEBUG == 'true') {
            this.version += '-dev';
            this.debug = true;
        }
        
        this.db_uri = database_uri;
        this.token = discord_token;

        this.event_loader = new EventLoader(this);
        this.command_manager = new CommandManager();

        this.guild = new GuildManager(this);
        this.music_manager = new MusicManager();
    }

    async init() {

        console.info(`Initializing MieciekBot ${this.version}...\n`);

        this.db_manager = new DatabaseManager(this.db_uri);

        this.event_loader.loadEvents();
        this.command_manager.loadCommands();
        
        await this.login(this.token);
        await this.guild.fetchAll();
    }

    async sendAndDelete(
        channel: Channel,
        msg: string,
        timeout = this.guild.get((channel as Discord.TextChannel).guild.id).delete_timeout
    ) {
        await channel.send(msg).then(msg => msg.delete({ timeout }));
    }

    async deleteMsg(
        msg: Discord.Message,
        timeout = this.guild.get(msg.guild.id).delete_timeout
    ) {
        msg.delete({ timeout });
    }

    announce(dscguild: Discord.Guild, channel: Channel, text: string) {
        let guild = this.guild.get(dscguild.id);

        if(guild.announce.channel) return guild.announce.channel.send(text);
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