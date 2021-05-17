import { Collection, NewsChannel, TextChannel } from 'discord.js';
import { Client, PermissionManager, UserManager, RolePermissionNode, UserPermissionNode } from '../';
import { Guild, IGuild } from '../../models';

export class GuildManager {

    client: Client;

    guilds = new Collection<string, IGuild>();
    guild_permission_manager = new Collection<string, PermissionManager>();
    guild_announce_channel = new Collection<string, TextChannel | NewsChannel>();
    guild_users = new Collection<string, UserManager>();

    constructor(client: Client) {
        this.client = client;
    }

    async fetchAll() {
        const guilds = await Guild.find({});
        for (const guild of guilds) this.fetchOne(guild);
    }

    async fetchOne(guild: IGuild) {

        const ID = guild.guildID;
        const GUILD = this.client.guilds.cache.get(ID);
        
        this.guilds.set(ID, guild);

        // permission manager
        let pmanager = new PermissionManager(GUILD);
        pmanager.addNode(new RolePermissionNode('MUTE',  guild.roles.mute,  1));
        pmanager.addNode(new RolePermissionNode('USER',  guild.roles.user,  2));
        pmanager.addNode(new RolePermissionNode('DJ',    guild.roles.dj  ,  3, ['USER', 'DJ']));
        pmanager.addNode(new RolePermissionNode('ADMIN', guild.roles.admin, 4, ['USER', 'DJ', 'ADMIN']));
        pmanager.addNode(new RolePermissionNode('OWNER', guild.roles.owner, 5, ['USER', 'DJ', 'ADMIN', 'OWNER']));
        pmanager.addNode(new UserPermissionNode('OWNER', GUILD.ownerID,     5, ['USER', 'DJ', 'ADMIN', 'OWNER']));
        this.guild_permission_manager.set(ID, pmanager);

        // announce channel
        let channel = GUILD.channels.cache.get(guild.announce.channel_id);

        if (channel instanceof TextChannel || channel instanceof NewsChannel) {
            this.guild_announce_channel.set(ID, channel);
        }

        // users
        let umanager = new UserManager(this.client, GUILD);
        this.guild_users.set(ID, umanager);
    }
}