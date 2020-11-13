const {bot} = require('../index.js');

bot.on('guildCreate', (guild) => {
    bot.db_manager.defaultServer(guild.id).save().catch(err => console.error(err));
    
    let owner = bot.users.cache.get(guild.ownerID);
    if(!owner) return guild.leave();

    owner.send(`Hi! I just configured your '${guild.name}' server. Please, set up all required permissions, roles and other useful properties. Have a good time!`).catch(err => {
        if(err) return console.error(err);
    });
});

bot.on('guildDelete', guild => {
    bot.db_manager.deleteServer(guild.id);
});