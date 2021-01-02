import * as Discord from 'discord.js';
import { AnyPermissionNode, Client, PermissionNodesManager, RolePermissionNode } from ".";
import { ServerAnnounceOptions, IGuild } from "../models";

interface ClientRoles {
    user: AnyPermissionNode;
    manager: PermissionNodesManager;
}

export class GuildManager {

    client: Client;

    prefix = new GuildPropertyManager<string>();
    delete_timeout = new GuildPropertyManager<number>();
    spam_channels = new GuildPropertyManager<string[]>();
    roles = new GuildPropertyManager<ClientRoles>();
    announce = new GuildPropertyManager<ServerAnnounceOptions>();

    constructor(client: Client) {
        this.client = client;
    }

    async fetchAll() {
        const guilds = await this.client.db_manager.models.Guild.find({});
        guilds.forEach(async guild => this.fetchOne(guild));
    }

    async fetchOne(guild: IGuild) {

        const ID = guild.guildID;
        const GUILD = this.client.guilds.cache.get(ID);

        this.prefix.set(ID, guild.prefix);
        this.delete_timeout.set(ID, guild.delete_timeout);
        this.spam_channels.set(ID, guild.spam_channels);

        // roles
        let manager = new PermissionNodesManager(GUILD);
        manager.addNode(new RolePermissionNode('MUTE',  guild.roles.mute,  1));
        manager.addNode(new RolePermissionNode('USER',  guild.roles.user,  2));
        manager.addNode(new RolePermissionNode('DJ',    guild.roles.dj,    3, ['USER', 'DJ']));
        manager.addNode(new RolePermissionNode('ADMIN', guild.roles.admin, 4, ['USER', 'DJ', 'ADMIN']));
        manager.addNode(new RolePermissionNode('OWNER', guild.roles.owner, 5, ['USER', 'DJ', 'ADMIN', 'OWNER']));
        this.roles.set(ID, { user: null, manager });

        // announce
        try {
            guild.announce.channel = await this.client.channels.cache.get(guild.announce.channel_id) as any;
        } catch(err) {
            guild.announce.channel = null;
        }
        this.announce.set(ID, guild.announce);
    }

    get(guildID: string) {
        return {
            guildID,
            prefix: this.prefix.get(guildID),
            delete_timeout: this.delete_timeout.get(guildID),
            spam_channels: this.spam_channels.get(guildID),
            roles: this.roles.get(guildID),
            announce: this.announce.get(guildID)
        };
    }
}

export interface GuildProperty<T> {
    guildID: string;
    value: T;
}

export class GuildPropertyManager<T> {

    private values: Discord.Collection<string, T> = new Discord.Collection();

    get(guildID: string) {
        return this.values.get(guildID);
    }

    set(guildID: string, value: T) {
        return this.values.set(guildID, value);
    }

    delete(guildID: string) {
        return this.values.delete(guildID);
    }

    clear() {
        this.values.clear();
    }
}