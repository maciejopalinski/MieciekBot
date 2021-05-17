import { Collection, Guild, GuildMember } from 'discord.js';
import { Client, AnyPermissionNode } from '../';
import { User, IUser } from '../../models';

export class UserManager {

    client: Client;
    guild: Guild;

    users = new Collection<string, IUser>();
    permission = new Collection<string, AnyPermissionNode>();

    constructor(client: Client, guild: Guild) {
        this.client = client;
        this.guild = guild;
    }

    async fetchDiscord(user: GuildMember) {
        const found = await User.findOne({ guildID: user.guild.id, userID: user.id });
        this.fetchOne(found);
    }

    async fetchOne(user: IUser) {
        const ID = user.userID;
        const USER = this.guild.members.cache.get(ID);
        
        this.users.set(ID, user);

        let manager = this.client.guild_manager.guild_permission_manager.get(user.guildID);
        let node = manager.getMemberNode(USER);
        this.permission.set(ID, node);
    }
}