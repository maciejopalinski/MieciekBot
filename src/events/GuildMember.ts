import { GuildMember, PartialGuildMember } from 'discord.js';
import { Client } from '../lib';

export const onGuildMemberRemove = async (client: Client, member: GuildMember | PartialGuildMember) => {
    (await client.db_manager.getUser(member.guild.id, member.id)).delete();

    let { announce } = client.guild_manager.getGuildConfig(member.guild.id);

    if(announce.toggles.remove_member) {
        client.announce(member.guild, `**<@${member.id}> left the server.**`);
    }
}

export const onGuildMemberAdd = async (client: Client, member: GuildMember) => {

    let { announce } = client.guild_manager.getGuildConfig(member.guild.id);

    if(announce.toggles.add_member) {
        client.announce(member.guild, `**<@${member.id}> joined the server!**`);
    }
}

export default (client: Client) => {
    client.on('guildMemberRemove', member => onGuildMemberRemove(client, member));
    client.on('guildMemberAdd', member => onGuildMemberAdd(client, member));
}