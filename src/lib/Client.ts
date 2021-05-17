import Discord, { NewsChannel, TextChannel } from 'discord.js';
import project_info from '../../package.json';
import { CommandManager, EventLoader, DatabaseManager, MusicManager, GuildManager } from './';

export type Channel = Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;

export class Client extends Discord.Client {
    
    project_info = project_info;
    version: string;
    debug = false;

    guild_manager: GuildManager;
    music_manager: MusicManager;

    event_loader: EventLoader;
    command_manager: CommandManager;
    db_manager: DatabaseManager;
    db_uri: string;

    constructor(client_options?: Discord.ClientOptions) {
        super(client_options);
        
        require('./ConsoleLogger');

        this.version = this.project_info.version;
        if (process.env.DEBUG == 'true') {
            this.version += '-dev';
            this.debug = true;
        }

        this.event_loader = new EventLoader(this);
        this.command_manager = new CommandManager();

        this.guild_manager = new GuildManager(this);
        this.music_manager = new MusicManager();
    }

    async init() {

        console.info(`Initializing MieciekBot ${this.version}...\n`);

        this.db_manager = new DatabaseManager(this.db_uri || process.env.DATABASE);

        this.event_loader.loadEvents();
        this.command_manager.loadCommands();
        
        await this.login(this.token || process.env.BOT_TOKEN);
        await this.guild_manager.fetchAll();
    }

    async sendAndDelete(
        channel: Channel,
        msg: string,
        timeout = this.guild_manager.guilds.get((<TextChannel> channel).guild.id).delete_timeout
    ) {
        await channel.send(msg).then(msg => msg.delete({ timeout }));
    }

    async deleteMsg(
        msg: Discord.Message,
        timeout = this.guild_manager.guilds.get(msg.guild.id).delete_timeout
    ) {
        msg.delete({ timeout });
    }

    announce(dscguild: Discord.Guild, text: string, channel?: Channel) {
        let announce_channel = this.guild_manager.guild_announce_channel.get(dscguild.id);

        if(announce_channel) return announce_channel.send(text);
        else if(channel) return channel.send(text);
        return null;
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