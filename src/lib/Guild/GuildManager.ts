import { Collection, GuildMember, NewsChannel, TextChannel } from 'discord.js';
import { Client, PermissionManager, UserManager, RolePermissionNode, UserPermissionNode } from '../';
import { Guild, IGuild, User, IUser } from '../../models';

export class GuildManager {

    client: Client;

    private guild_config = new Collection<string, IGuild>();
    private guild_permission = new Collection<string, PermissionManager>();
    private guild_announce = new Collection<string, TextChannel | NewsChannel>();
    private guild_users = new Collection<string, UserManager>();

    constructor(client: Client) {
        this.client = client;
    }

    async fetchAllGuilds() {
        const guilds = await Guild.find({ guildID: { $in: this.client.guilds.cache.keyArray() } });
        for (const guild of guilds) {
            this.fetchGuild(guild);
        }
    }

    async fetchGuild(guild: IGuild) {

        const ID = guild.guildID;
        const GUILD = this.client.guilds.cache.get(ID);

        await this.client.guilds.fetch(ID);

        this.guild_config.set(ID, guild);

        // permission manager
        let pmanager = new PermissionManager(GUILD);
        pmanager.addNode(new RolePermissionNode('MUTE',  guild.roles.mute,  1));
        pmanager.addNode(new RolePermissionNode('USER',  guild.roles.user,  2));
        pmanager.addNode(new RolePermissionNode('DJ',    guild.roles.dj  ,  3, ['USER', 'DJ']));
        pmanager.addNode(new RolePermissionNode('ADMIN', guild.roles.admin, 4, ['USER', 'DJ', 'ADMIN']));
        pmanager.addNode(new RolePermissionNode('OWNER', guild.roles.owner, 5, ['USER', 'DJ', 'ADMIN', 'OWNER']));
        pmanager.addNode(new UserPermissionNode('OWNER', GUILD.ownerID,     5, ['USER', 'DJ', 'ADMIN', 'OWNER']));
        this.guild_permission.set(ID, pmanager);

        // announce channel
        let channel = GUILD.channels.cache.get(guild.announce.channel_id);

        if (channel instanceof TextChannel || channel instanceof NewsChannel) {
            this.guild_announce.set(ID, channel);
        }

        // users
        let umanager = new UserManager(this.client, GUILD);
        this.guild_users.set(ID, umanager);
    }

    async fetchUser(member: GuildMember) {
        await this.getUserManager(member.guild.id).fetchUser(member);
    }

    getGuildConfig(gid: string) {
        return this.guild_config.get(gid);
    }

    getPermissionManager(gid: string) {
        return this.guild_permission.get(gid);
    }

    getAnnounceChannel(gid: string) {
        return this.guild_announce.get(gid);
    }

    getUserManager(gid: string) {
        return this.guild_users.get(gid);
    }

    getUserXP(gid: string, uid: string) {
        return this.getUserManager(gid).getUserXP(uid);
    }

    getUserPermission(gid: string, uid: string) {
        return this.getUserManager(gid).getUserPermission(uid);
    }
}