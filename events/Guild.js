const {bot} = require('../index.js');
const MessageEmbed = require('../lib/message/MessageEmbed');

bot.on('guildCreate', async guild => {
    await bot.db_manager.defaultServer(guild.id).save().catch(err => console.error(err));
    
    let owner = await bot.users.fetch(guild.ownerID);
    if(!owner) return guild.leave();

    let owner_embed = new MessageEmbed(bot, guild)
    .setTitle(guild.name)
    .addField('Hi! I just configured your server.', 'Please, set up all required permissions, roles and other useful properties.')
    .addField('\u200b', 'Have a good time!');
    
    owner.send(owner_embed).catch(err => {
        if(err) return console.error(err);
    });

    console.info(`Adding guild... (GID:${guild.id})`);
});

bot.on('guildDelete', guild => {
    bot.db_manager.deleteServer(guild.id);
    
    console.info(`Deleting guild... (GID:${guild.id})`);
});