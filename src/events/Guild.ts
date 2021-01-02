import { Guild } from 'discord.js';
import { Client, MessageEmbed } from '../lib';

export const onGuildCreate = async (client: Client, guild: Guild) => {
    await client.db_manager.models.Guild.create({ guildID: guild.id }).catch(err => console.error(err));
        
    let owner = await client.users.fetch(guild.ownerID);
    if(!owner) return guild.leave();

    let owner_embed = new MessageEmbed(client, guild)
    .setTitle(guild.name)
    .addField('Hi! I just configured your server.', 'Please, set up all required permissions, roles and other useful properties.')
    .addField('\u200b', 'Have a good time!');
    
    owner.send(owner_embed).catch(err => {
        if(err) return console.error(err);
    });

    console.info(`Adding guild... (GID:${guild.id})`);
}

export const onGuildDelete = async (client: Client, guild: Guild) => {
    await client.db_manager.deleteGuildData(guild.id);
        
    console.info(`Deleting guild... (GID:${guild.id})`);
}

export default (client: Client) => {
    client.on('guildCreate', async guild => onGuildCreate(client, guild));
    client.on('guildDelete', async guild => onGuildDelete(client, guild));
}