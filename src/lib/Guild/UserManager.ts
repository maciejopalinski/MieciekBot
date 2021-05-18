import { Collection, Guild, GuildMember } from 'discord.js';
import { Client, AnyPermissionNode } from '../';
import { User, IUser } from '../../models';

export class UserManager {

    client: Client;
    guild: Guild;

    user_xp = new Collection<string, IUser>();
    permission = new Collection<string, AnyPermissionNode>();

    constructor(client: Client, guild: Guild) {
        this.client = client;
        this.guild = guild;
    }

    async fetchUser(member: GuildMember) {
        if (this.getUserPermission(member.id)) return;

        const GID = member.guild.id;
        const UID = member.id;

        const found = await User.findOne({ guildID: GID, userID: UID });
        this.user_xp.set(UID, found);

        let highest = this.client.guild_manager.getPermissionManager(GID).getMemberNode(member);
        this.permission.set(UID, highest);
    }

    getUserXP(uid: string) {
        return this.user_xp.get(uid);
    }

    getUserPermission(uid: string) {
        return this.permission.get(uid);
    }
}