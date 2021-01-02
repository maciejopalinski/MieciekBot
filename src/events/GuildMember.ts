import { GuildMember, PartialGuildMember } from 'discord.js';
import { Client } from '../lib';

export const onGuildMemberRemove = async (client: Client, member: GuildMember | PartialGuildMember) => {
    (await client.db_manager.getUser(member.guild.id, member.id)).delete();
        
    // TODO: this is completelly wrong. it needs to check for guild announce_options
    if(client.announce_options.toggles.remove_member) {
        client.announce(undefined, `**<@${member.id}> left the server.**`);
    }
}

export const onGuildMemberAdd = async (client: Client, member: GuildMember) => {
    
    // TODO: this is completelly wrong. it needs to check for guild announce_options
    if(client.announce_options.toggles.add_member) {
        client.announce(undefined, `**<@${member.id}> joined the server!**`);
    }
}

export default (client: Client) => {
    client.on('guildMemberRemove', async member => onGuildMemberRemove(client, member));
    client.on('guildMemberAdd', member => onGuildMemberAdd(client, member));
}